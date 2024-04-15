export interface TranslationsObjT {
	languageId: number;
	value: string | null;
}

export const removeDuplicates = (translations: TranslationsObjT[]) =>
	translations.filter(
		(translation, index, self) =>
			index ===
			self.findIndex((t) => t.languageId === translation.languageId),
	);

export const mergeTranslationGroups = <K>(
	items: Array<{
		translations: TranslationsObjT[];
		key: K;
	}>,
) => {
	const translations: {
		languageId: number;
		value: string | null;
		key: K;
	}[] = [];
	for (const item of items) {
		const itemTranslations = removeDuplicates(item.translations);
		for (const translation of itemTranslations) {
			translations.push({
				...translation,
				key: item.key,
			});
		}
	}
	return translations;
};

export const getUniqueLanguageIDs = (items: Array<TranslationsObjT[]>) => {
	const languageIds = items.flatMap((t) => t.map((t) => t.languageId));
	return Array.from(new Set(languageIds));
};

export const shouldUpdateTranslations = (
	item: Array<TranslationsObjT[] | undefined>,
) => item.some((t) => t !== undefined && t.length > 0);
