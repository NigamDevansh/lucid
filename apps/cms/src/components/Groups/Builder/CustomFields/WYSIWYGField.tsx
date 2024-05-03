import {
	type Component,
	type Accessor,
	createSignal,
	createEffect,
} from "solid-js";
import type { CustomField } from "@protoheadless/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";
interface WYSIWYGFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId?: number | string;
		contentLanguage?: number;

		getFieldPath: Accessor<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
	};
}

export const WYSIWYGField: Component<WYSIWYGFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal("");

	// -------------------------------
	// Effects
	createEffect(() => {
		const field = brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			field: props.state.field,
			contentLanguage: props.state.contentLanguage,
		});

		const value = (field?.value as string | undefined) || "";
		setValue(value);
	});

	// -------------------------------
	// Render
	return (
		<Form.WYSIWYG
			id={`field-${props.state.field.key}-${props.state.brickIndex}-${props.state.groupId}`}
			value={getValue()}
			onChange={(value) =>
				brickStore.get.setFieldValue({
					brickIndex: props.state.brickIndex,
					fieldPath: props.state.getFieldPath(),
					groupPath: props.state.getGroupPath(),
					value: value,
				})
			}
			copy={{
				label: props.state.field.title,
				placeholder: props.state.field.placeholder,
				describedBy: props.state.field.description,
			}}
			// errors={props.state.fieldError}
			required={props.state.field.validation?.required || false}
		/>
	);
};
