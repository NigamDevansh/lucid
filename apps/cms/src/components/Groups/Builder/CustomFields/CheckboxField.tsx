import {
	type Component,
	createSignal,
	createMemo,
	batch,
	createEffect,
} from "solid-js";
import type {
	CFConfig,
	FieldResponse,
	FieldErrors,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface CheckboxFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CFConfig<"checkbox">;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLocale: string;
		fieldError: FieldErrors | undefined;
		altLocaleHasError: boolean;
	};
}

export const CheckboxField: Component<CheckboxFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal(0);

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});
	const fieldValue = createMemo(() => {
		return brickHelpers.getFieldValue<1 | 0>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLocale: props.state.contentLocale,
		});
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		setValue(fieldValue() || 0);
	});

	// -------------------------------
	// Render
	return (
		<Form.Switch
			id={brickHelpers.customFieldId({
				key: props.state.fieldConfig.key,
				brickIndex: props.state.brickIndex,
				groupId: props.state.groupId,
			})}
			value={getValue() === 1}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldConfig: props.state.fieldConfig,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: value ? 1 : 0,
						contentLocale: props.state.contentLocale,
					});
					setValue(value ? 1 : 0);
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
				true: brickHelpers.getFieldLabel({
					value: props.state.fieldConfig.labels.true,
					locale: props.state.contentLocale,
				}),
				false: brickHelpers.getFieldLabel({
					value: props.state.fieldConfig.labels.false,
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
