import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import { swaggerBodyBricksObj } from "../../schemas/collection-bricks.js";
import { swaggerFieldObj } from "../../schemas/collection-fields.js";
import buildResponse from "../../utils/build-response.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const upsertSingleController: RouteController<
	typeof collectionDocumentsSchema.upsertSingle.params,
	typeof collectionDocumentsSchema.upsertSingle.body,
	typeof collectionDocumentsSchema.upsertSingle.query
> = async (request, reply) => {
	const documentId = await serviceWrapper(
		LucidServices.collection.document.upsertSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: request.body.documentId
					? T("route_document_update_error_name")
					: T("route_document_create_error_name"),
				message: request.body.documentId
					? T("route_document_update_error_message")
					: T("route_document_create_error_message"),
				status: 500,
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			collectionKey: request.params.collectionKey,
			userId: request.auth.id,
			documentId: request.body.documentId,
			bricks: request.body.bricks,
			fields: request.body.fields,
		},
	);
	if (documentId.error) throw new LucidAPIError(documentId.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: {
				id: documentId.data,
			},
		}),
	);
};

export default {
	controller: upsertSingleController,
	zodSchema: collectionDocumentsSchema.upsertSingle,
	swaggerSchema: {
		description: "Create or update a single collection document.",
		tags: ["collection-documents"],
		summary: "Create or update a single collection document.",
		body: {
			type: "object",
			properties: {
				documentId: {
					type: "number",
				},
				bricks: {
					type: "array",
					items: swaggerBodyBricksObj,
				},
				fields: {
					type: "array",
					items: swaggerFieldObj,
				},
			},
		},
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "object",
					properties: {
						id: {
							type: "number",
						},
					},
				},
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
