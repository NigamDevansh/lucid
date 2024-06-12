import {
	type Component,
	createSignal,
	createEffect,
	createMemo,
	batch,
} from "solid-js";
import type {
	CFConfig,
	FieldResponse,
	FieldErrors,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface JSONFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CFConfig<"json">;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLocale: string;
		fieldError: FieldErrors | undefined;
		altLocaleHasError: boolean;
	};
}

export const JSONField: Component<JSONFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal("");

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});
	const fieldValue = createMemo(() => {
		return brickHelpers.getFieldValue<string>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLocale: props.state.contentLocale,
		});
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		setValue(JSON.stringify(fieldValue() ?? "", null, 4));
	});

	// -------------------------------
	// Render
	return (
		<Form.JSONTextarea
			id={brickHelpers.customFieldId({
				key: props.state.fieldConfig.key,
				brickIndex: props.state.brickIndex,
				groupId: props.state.groupId,
			})}
			value={getValue()}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldConfig: props.state.fieldConfig,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: JSON.parse(value),
						contentLocale: props.state.contentLocale,
					});
					setValue(value);
				});
			}}
			name={props.state.fieldConfig.key}
			copy={{
				label: brickHelpers.getFieldLabel({
					value: props.state.fieldConfig.labels.title,
					locale: props.state.contentLocale,
				}),
				describedBy: brickHelpers.getFieldLabel({
					value: props.state.fieldConfig.labels.description,
					locale: props.state.contentLocale,
				}),
				placeholder: brickHelpers.getFieldLabel({
					value: props.state.fieldConfig.labels.placeholder,
					locale: props.state.contentLocale,
				}),
			}}
			altLocaleHasError={props.state.altLocaleHasError}
			disabled={props.state.fieldConfig.disabled}
			errors={props.state.fieldError}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
