import { Component, Show, createSignal } from "solid-js";
import classnames from "classnames";
// Types
import type { ErrorResult, FieldError } from "@/types/api";
// Components
import Form from "@/components/Groups/Form";

interface JSONTextareaProps {
	id: string;
	value: string;
	onChange: (_value: string) => void;
	name: string;
	copy?: {
		label?: string;
		placeholder?: string;
		describedBy?: string;
	};
	onBlur?: () => void;
	autoFoucs?: boolean;
	onKeyUp?: (_e: KeyboardEvent) => void;
	required?: boolean;
	disabled?: boolean;
	errors?: ErrorResult | FieldError;
	noMargin?: boolean;
	theme?: "basic";
}

export const JSONTextarea: Component<JSONTextareaProps> = (props) => {
	// -------------------------------
	// State
	const [inputFocus, setInputFocus] = createSignal(false);
	const [jsonError, setJsonError] = createSignal({
		hasError: false,
		line: 0,
		column: 0,
		position: 0,
	});

	// -------------------------------
	// Functions
	const validateJSON = (value: string) => {
		try {
			JSON.parse(value);
			setJsonError({
				hasError: false,
				line: 0,
				column: 0,
				position: 0,
			});
		} catch (e) {
			const error = e as Error;
			const message = error.message;
			const position = message.match(/position (\d+)/);
			const line = message.match(/line (\d+)/);
			const column = message.match(/column (\d+)/);
			setJsonError({
				hasError: true,
				line: line ? parseInt(line[1]) : 0,
				column: column ? parseInt(column[1]) : 0,
				position: position ? parseInt(position[1]) : 0,
			});
		}
	};
	const inputChange = (
		e: InputEvent & {
			currentTarget: HTMLTextAreaElement;
			target: HTMLTextAreaElement;
		},
	) => {
		const textarea = e.currentTarget;

		validateJSON(textarea.value);
		props.onChange(textarea.value);
	};

	// ----------------------------------------
	// Render
	return (
		<div
			class={classnames("w-full", {
				"mb-0": props.noMargin,
				"mb-5 last:mb-0": !props.noMargin,
			})}
		>
			<div
				class={classnames(
					"flex flex-col transition-colors duration-200 ease-in-out relative",
					{
						"border-secondary bg-backgroundAccentH":
							inputFocus() && props.theme !== "basic",
						"border-error": props.errors?.message !== undefined,
						"bg-backgroundAccent rounded-md border":
							props.theme !== "basic",
					},
				)}
			>
				<Form.Label
					id={props.id}
					label={props.copy?.label}
					focused={inputFocus()}
					required={props.required}
					theme={props.theme}
				/>
				<div class="relative">
					<textarea
						class={classnames(
							"focus:outline-none text-sm text-title font-medium resize-none w-full h-52 block",
							{
								"pt-2": props.copy?.label === undefined,
								"bg-container border border-border rounded-md mt-1 p-2.5 focus:border-secondary duration-200 transition-colors":
									props.theme === "basic",
								"bg-transparent pb-2 px-2.5 pt-1 rounded-b-md":
									props.theme !== "basic",
							},
						)}
						onKeyDown={(e) => {
							e.stopPropagation();
							const textarea = e.currentTarget;

							if (e.key === "Tab") {
								e.preventDefault();
								const start = textarea.selectionStart;
								const end = textarea.selectionEnd;
								const value = textarea.value;
								textarea.value = `${value.substring(
									0,
									start,
								)}\t${value.substring(end, value.length)}`;
								textarea.selectionStart =
									textarea.selectionEnd = start + 1;
							}
						}}
						id={props.id}
						name={props.name}
						value={props.value}
						onInput={inputChange}
						placeholder={props.copy?.placeholder}
						aria-describedby={
							props.copy?.describedBy
								? `${props.id}-description`
								: undefined
						}
						autofocus={props.autoFoucs}
						required={props.required}
						disabled={props.disabled}
						onFocus={() => setInputFocus(true)}
						onKeyUp={(e) => props.onKeyUp?.(e)}
						onBlur={() => {
							setInputFocus(false);
							props.onBlur?.();
						}}
					/>
					<Show when={jsonError().hasError}>
						<div class="bg-error rounded-md px-15 text-white text-sm py-1 absolute bottom-15 right-15">
							Invalid JSON on line {jsonError().line}
						</div>
					</Show>
				</div>
			</div>
			<Form.DescribedBy
				id={props.id}
				describedBy={props.copy?.describedBy}
			/>
			<Form.ErrorMessage id={props.id} errors={props.errors} />
		</div>
	);
};
