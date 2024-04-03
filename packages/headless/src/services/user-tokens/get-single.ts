import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	token_type: "password_reset";
	token: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const UserTokensRepo = RepositoryFactory.getRepository(
		"user-tokens",
		serviceConfig.db,
	);

	const userToken = await UserTokensRepo.selectSingle({
		select: ["id", "user_id"],
		where: [
			{
				key: "token",
				operator: "=",
				value: data.token,
			},
			{
				key: "token_type",
				operator: "=",
				value: data.token_type,
			},
			{
				key: "expiry_date",
				operator: ">",
				value: new Date().toISOString(),
			},
		],
	});

	if (userToken === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("token"),
			}),
			message: T("error_not_found_message", {
				name: T("token"),
			}),
			status: 404,
		});
	}

	return userToken;
};

export default getSingle;