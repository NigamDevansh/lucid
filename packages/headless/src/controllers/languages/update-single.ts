import languageSchema from "../../schemas/languages.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import languages from "../../services/languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

const updateSingleController: ControllerT<
	typeof languageSchema.updateSingle.params,
	typeof languageSchema.updateSingle.body,
	typeof languageSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(languages.updateSingle, true)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			current_code: request.params.code,
			code: request.body.code,
			is_default: request.body.is_default,
			is_enabled: request.body.is_enabled,
		},
	);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: languageSchema.updateSingle,
	swaggerSchema: {
		description: "Update a single language with the given data.",
		tags: ["languages"],
		summary: "Update a single language",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				code: {
					type: "string",
				},
				is_default: {
					type: "number",
				},
				is_enabled: {
					type: "number",
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};