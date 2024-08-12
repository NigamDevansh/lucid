import type { CollectionConfig } from "../types/index.js";
import type { FieldSchemaType, ServiceResponse } from "@lucidcms/core/types";

/**
 *  Update the fullSlug field with the computed value
 */
const setFullSlug = (data: {
	fullSlug: Record<string, string | null>;
	collection: CollectionConfig;
	defaultLocale: string;
	fields: {
		fullSlug: FieldSchemaType;
	};
}): Awaited<ServiceResponse<undefined>> => {
	if (data.collection.translations) {
		data.fields.fullSlug.translations = data.fullSlug;
	} else {
		data.fields.fullSlug.value = data.fullSlug[data.defaultLocale];
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default setFullSlug;
