import type { BrickSchema } from "../../../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../../../schemas/collection-fields.js";
import flattenFields, {
	type GroupInsertItem,
	type FieldInsertItem,
} from "./flatten-fields.js";

export interface BrickInsertItem extends BrickSchema {
	id?: number;
	fields: Array<FieldInsertItem>;
	groups: Array<GroupInsertItem>;
}

const formatInsertBricks = (props: {
	bricks?: Array<BrickSchema>;
	fields?: Array<FieldSchemaType>;
	documentId: number;
}): Array<BrickInsertItem> => {
	const bricksRes: Array<BrickInsertItem> = [];

	if (props.bricks !== undefined) {
		for (let i = 0; i < props.bricks.length; i++) {
			const brick = props.bricks[i];
			if (brick === undefined) continue;

			const flat = flattenFields(brick.fields ?? []);

			bricksRes.push({
				key: brick.key,
				order: brick.order,
				type: brick.type,
				fields: flat.fields,
				groups: flat.groups,
			});
		}
	}

	if (props.fields !== undefined) {
		const flat = flattenFields(props.fields);
		bricksRes.push({
			type: "collection-fields",
			fields: flat.fields,
			groups: flat.groups,
		});
	}

	return bricksRes;
};

export default formatInsertBricks;
