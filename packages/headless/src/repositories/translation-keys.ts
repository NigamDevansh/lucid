import { deleteQB, type QueryBuilderWhereT } from "../libs/db/query-builder.js";

export default class TranslationKeysRepo {
	constructor(private db: DB) {}

	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_translation_keys">;
	}) => {
		let query = this.db.deleteFrom("headless_translation_keys");

		query = deleteQB(query, props.where);

		return query.execute();
	};
	// ----------------------------------------
	// create
	createMultiple = async (
		props: {
			createdAt: string;
		}[],
	) => {
		return this.db
			.insertInto("headless_translation_keys")
			.values(props.map((d) => ({ created_at: d.createdAt })))
			.returning("id")
			.execute();
	};
}
