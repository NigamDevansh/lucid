import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import constants from "../../constants/constants.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import lucidServices from "../index.js";
import type { ServiceConfig, ServiceFn } from "../../libs/services/types.js";

const defaultRoles: ServiceFn<[], undefined> = async (
	service: ServiceConfig,
) => {
	const RolesRepo = Repository.get("roles", service.db);

	const totalRoleCount = await RolesRepo.count();
	if (Formatter.parseCount(totalRoleCount?.count) > 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	const rolePromises = [];
	for (const role of constants.seedDefaults.roles) {
		rolePromises.push(
			serviceWrapper(lucidServices.role.createSingle, {
				transaction: false,
			})(service, {
				name: role.name,
				description: role.description,
				permissions: role.permissions,
			}),
		);
	}
	await Promise.all(rolePromises);

	return {
		error: undefined,
		data: undefined,
	};
};

export default defaultRoles;