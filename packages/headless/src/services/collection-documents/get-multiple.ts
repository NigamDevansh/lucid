import type z from "zod";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import collectionsServices from "../collections/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

export interface ServiceData {
	collectionKey: string;
	query: z.infer<typeof collectionDocumentsSchema.getMultiple.query>;
	languageId: number;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const collectionInstance = await collectionsServices.getSingleInstance({
		key: data.collectionKey,
	});

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);
	const CollectionDocumentsFormatter = Formatter.get("collection-documents");

	const [documents, documentCount] =
		await CollectionDocumentsRepo.selectMultipleFiltered({
			query: data.query,
			languageId: data.languageId,
			allowedFieldFilters: collectionInstance.data.config.fields.filter,
			allowedFieldIncludes: collectionInstance.data.config.fields.include,
			config: serviceConfig.config,
		});

	return {
		data: CollectionDocumentsFormatter.formatMultiple({
			documents: documents,
			collection: collectionInstance,
			host: serviceConfig.config.host,
		}),
		count: Formatter.parseCount(documentCount?.count),
	};
};

export default getMultiple;
