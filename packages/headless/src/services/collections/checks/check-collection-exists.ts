import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";

export interface ServiceData {
	key: string;
}

const checkCollectionExists = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const collectionExists = await serviceConfig.db
		.selectFrom("headless_collections")
		.select("key")
		.where("key", "=", data.key)
		.executeTakeFirst();

	if (collectionExists !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("collection"),
			}),
			message: T("error_not_created_message", {
				name: T("collection"),
			}),
			status: 400,
			errors: modelErrors({
				key: {
					code: "invalid",
					message: T("duplicate_entry_error_message"),
				},
			}),
		});
	}
};

export default checkCollectionExists;
