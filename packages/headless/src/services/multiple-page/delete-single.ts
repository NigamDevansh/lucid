import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deletePage = await serviceConfig.db
		.updateTable("headless_collection_multiple_page")
		.set({
			is_deleted: true,
			is_deleted_at: new Date(),
			slug: null,
			full_slug: null,
		})
		.where("id", "=", data.id)
		.returning("id")
		.executeTakeFirst();

	if (deletePage === undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("page"),
			}),
			message: T("deletion_error_message", {
				name: T("page").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
