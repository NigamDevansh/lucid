import mediaSchema from "../../schemas/media.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "../../services/media/index.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerMediaRes } from "../../format/format-media.js";

const getSingleController: ControllerT<
	typeof mediaSchema.getSingle.params,
	typeof mediaSchema.getSingle.body,
	typeof mediaSchema.getSingle.query
> = async (request, reply) => {
	const media = await serviceWrapper(mediaServices.getSingle, false)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id),
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: media,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: mediaSchema.getSingle,
	swaggerSchema: {
		description: "Get a single media item by id.",
		tags: ["media"],
		summary: "Get a single media item.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerMediaRes,
			}),
		},
	},
};