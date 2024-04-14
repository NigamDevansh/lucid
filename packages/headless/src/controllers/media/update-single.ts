import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "../../services/media/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const updateSingleController: ControllerT<
	typeof mediaSchema.updateSingle.params,
	typeof mediaSchema.updateSingle.body,
	typeof mediaSchema.updateSingle.query
> = async (request, reply) => {
	try {
		await serviceWrapper(mediaServices.updateSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				id: Number.parseInt(request.params.id),
				file_data: await request.file(),
				title_translations: request.body.title_translations,
				alt_translations: request.body.alt_translations,
			},
		);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("media"),
				method: T("update"),
			}),
			message: T("update_error_message", {
				name: T("media").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default {
	controller: updateSingleController,
	zodSchema: mediaSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single media entry with translations and new upload.",
		tags: ["media"],
		summary: "Update a single media entry.",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		consumes: ["multipart/form-data"],
		body: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
		querystring: {
			type: "object",
			required: ["body"],
			properties: {
				body: {
					type: "string",
					description:
						'Stringified JSON data containing tile_translations and alt_translations for the media.<br><br>Example: <code>{"title_translations":[{"language_id":1,"value":"title value"}],"alt_translations":[{"language_id":1,"value":"alt value"}]}</code>.<br><br>Translations dont have to be passed.',
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
