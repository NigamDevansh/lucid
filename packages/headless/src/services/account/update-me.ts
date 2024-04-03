import T from "../../translations/index.js";
import type { FastifyRequest } from "fastify";
import { APIError } from "../../utils/error-handler.js";
import usersService from "../users/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	auth: FastifyRequest["auth"];
	first_name?: string;
	last_name?: string;
	username?: string;
	email?: string;
	role_ids?: number[];
}

const updateMe = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const UsersRepo = RepositoryFactory.getRepository(
		"users",
		serviceConfig.db,
	);

	const getUser = await UsersRepo.selectSingle({
		select: ["super_admin"],
		where: [
			{
				key: "id",
				operator: "=",
				value: data.auth.id,
			},
		],
	});

	if (getUser === undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("account"),
			}),
			message: T("error_not_found_message", {
				name: T("account"),
			}),
			status: 404,
		});
	}

	const [userWithEmail, userWithUsername] = await Promise.all([
		data.email !== undefined
			? UsersRepo.selectSingle({
					select: ["id"],
					where: [
						{
							key: "email",
							operator: "=",
							value: data.email,
						},
						{
							key: "id",
							operator: "!=",
							value: data.auth.id,
						},
					],
			  })
			: undefined,
		data.username !== undefined
			? UsersRepo.selectSingle({
					select: ["id"],
					where: [
						{
							key: "username",
							operator: "=",
							value: data.username,
						},
						{
							key: "id",
							operator: "!=",
							value: data.auth.id,
						},
					],
			  })
			: undefined,
		data.role_ids !== undefined
			? serviceWrapper(usersService.checks.checkRolesExist, false)(
					serviceConfig,
					{
						role_ids: data.role_ids,
						is_create: false,
					},
			  )
			: undefined,
	]);

	if (data.email !== undefined && userWithEmail !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("account"),
			}),
			message: T("this_email_is_already_in_use"),
			status: 400,
		});
	}
	if (data.username !== undefined && userWithUsername !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("account"),
			}),
			message: T("this_username_is_already_in_use"),
			status: 400,
		});
	}

	const updateMe = await UsersRepo.updateSingle({
		data: {
			firstName: data.first_name,
			lastName: data.last_name,
			username: data.username,
			email: data.email,
			updatedAt: new Date().toISOString(),
		},
		where: [
			{
				key: "id",
				operator: "=",
				value: data.auth.id,
			},
		],
	});

	if (updateMe === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("account"),
			}),
			message: T("update_error_message", {
				name: T("your_account"),
			}),
			status: 400,
		});
	}

	// TODO: send email to user to confirm email change ?

	if (getUser.super_admin === 0) return;

	await serviceWrapper(usersService.updateMultipleRoles, false)(
		serviceConfig,
		{
			user_id: data.auth.id,
			role_ids: data.role_ids,
		},
	);
};

export default updateMe;