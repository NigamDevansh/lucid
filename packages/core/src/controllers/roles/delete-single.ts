import T from "../../translations/index.js";
import rolesSchema from "../../schemas/roles.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const deleteSingleController: RouteController<
	typeof rolesSchema.deleteSingle.params,
	typeof rolesSchema.deleteSingle.body,
	typeof rolesSchema.deleteSingle.query
> = async (request, reply) => {
	const deleteSingle = await serviceWrapper(LucidServices.role.deleteSingle, {
		transaction: true,
		defaultError: {
			type: "basic",
			name: T("route_roles_delete_error_name"),
			message: T("route_roles_delete_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id),
		},
	);
	if (deleteSingle.error) throw new LucidAPIError(deleteSingle.error);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: rolesSchema.deleteSingle,
	swaggerSchema: {
		description: "Delete a single role based on the given role id.",
		tags: ["roles"],
		summary: "Delete a single role",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
