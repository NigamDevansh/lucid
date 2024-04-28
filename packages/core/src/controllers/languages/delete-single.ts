import T from "../../translations/index.js";
import languageSchema from "../../schemas/languages.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import languages from "../../services/languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const deleteSingleController: RouteController<
	typeof languageSchema.deleteSingle.params,
	typeof languageSchema.deleteSingle.body,
	typeof languageSchema.deleteSingle.query
> = async (request, reply) => {
	try {
		await serviceWrapper(languages.deleteSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				code: request.params.code,
			},
		);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("language"),
				method: T("delete"),
			}),
			message: T("deletion_error_message", {
				name: T("language").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default {
	controller: deleteSingleController,
	zodSchema: languageSchema.deleteSingle,
	swaggerSchema: {
		description: "Delete a single language based on the given code.",
		tags: ["languages"],
		summary: "Delete a single code",
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