import T from "../../translations/index.js";
import type z from "zod";
import type cdnSchema from "../../schemas/cdn.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import { PassThrough, type Readable } from "node:stream";
import processedImageServices from "./index.js";
import mediaHelpers from "../../utils/media-helpers.js";
import Repository from "../../libs/repositories/index.js";
import mediaServices from "../media/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	key: string;
	processKey: string;
	options: z.infer<typeof cdnSchema.streamSingle.query>;
}

const processImage = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
): Promise<{
	key: string;
	contentLength: number | undefined;
	contentType: string | undefined;
	body: Readable;
}> => {
	const mediaStrategy = mediaServices.checks.checkHasMediaStrategy({
		config: serviceConfig.config,
	});

	const res = await mediaStrategy.stream(data.key);

	// If there is no response
	if (!res.success || !res.response) {
		throw new HeadlessAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("media"),
			}),
			message: T("error_not_found_message", {
				name: T("media"),
			}),
			status: 404,
		});
	}

	// If the response is not an image
	if (!res.response?.contentType?.startsWith("image/")) {
		return {
			key: data.key,
			contentLength: res.response.contentLength,
			contentType: res.response.contentType,
			body: res.response.body,
		};
	}

	// Optimise image
	const imageRes = await processedImageServices.optimiseImage(serviceConfig, {
		buffer: await mediaHelpers.streamToBuffer(res.response.body),
		options: data.options,
	});

	if (!imageRes.success || !imageRes.data) {
		return {
			key: data.key,
			contentLength: res.response.contentLength,
			contentType: res.response.contentType,
			body: res.response.body,
		};
	}

	const stream = new PassThrough();
	stream.end(Buffer.from(imageRes.data.buffer));

	// Check if the processed image limit has been reached for this key, if so return processed image without saving
	const processedCount = await processedImageServices.getSingleCount(
		serviceConfig,
		{
			key: data.key,
		},
	);

	const processedLimit = serviceConfig.config.media.processed.limit;

	if (processedCount >= processedLimit) {
		return {
			key: data.processKey,
			contentLength: imageRes.data.size,
			contentType: imageRes.data.mimeType,
			body: stream,
		};
	}

	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	if (serviceConfig.config.media.processed.store === true) {
		Promise.all([
			ProcessedImagesRepo.createSingle({
				key: data.processKey,
				mediaKey: data.key,
			}),
			mediaStrategy.uploadSingle({
				key: data.processKey,
				data: imageRes.data.buffer,
				meta: {
					mimeType: imageRes.data.mimeType,
					fileExtension: imageRes.data.extension,
					size: imageRes.data.size,
					width: imageRes.data.width,
					height: imageRes.data.height,
					type: "image",
					key: data.processKey,
				},
			}),
		]);
	}

	return {
		key: data.processKey,
		contentLength: imageRes.data.size,
		contentType: imageRes.data.mimeType,
		body: stream,
	};
};

export default processImage;