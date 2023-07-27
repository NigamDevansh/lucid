import { Component, Show, createSignal, For, onMount } from "solid-js";
import classnames from "classnames";
// Components
import {
  FaSolidTriangleExclamation,
  FaSolidCheck,
  FaSolidXmark,
  FaSolidSort,
} from "solid-icons/fa";
import { DropdownMenu } from "@kobalte/core";

export type SelectMultipleValueT = {
  value: string | number;
  label: string;
};

interface SelectMultipleProps {
  id: string;
  values: SelectMultipleValueT[];
  onChange: (value: SelectMultipleValueT[]) => void;
  options: SelectMultipleValueT[];
  name: string;
  copy: {
    label: string;
    placeholder?: string;
    describedBy?: string;
  };
  required?: boolean;
  disabled?: boolean;
  errors?: ErrorResult;
}

const SelectMultiple: Component<SelectMultipleProps> = (props) => {
  const [height, setHeight] = createSignal(0);
  const [open, setOpen] = createSignal(true);
  let selectContentRef: HTMLDivElement | undefined;

  // ----------------------------------------
  // Functions
  const setValues = (value: SelectMultipleValueT[]) => {
    props.onChange(value);
    setHeight(selectContentRef?.clientHeight ?? 0);
  };
  const toggleValue = (value: SelectMultipleValueT) => {
    const exists = props.values.find((v) => v.value === value.value);
    if (!exists) {
      setValues([...props.values, value]);
    } else {
      setValues(props.values.filter((v) => v.value !== value.value));
    }
  };

  // ----------------------------------------
  // Effects
  onMount(() => {
    if (selectContentRef) {
      setHeight(selectContentRef.clientHeight);
    }
  });

  // ----------------------------------------
  // Render
  return (
    <div class="mb-5 last:mb-0 w-full relative">
      {/* Select Content Overlay */}
      <div
        ref={selectContentRef}
        class="pointer-events-none absolute bottom-0 left-0 right-0 w-full z-10 bg-transparent mt-1 focus:outline-none px-2.5 pb-2 rounded-b-md text-sm text-title min-h-[32px] font-medium justify-between flex "
      >
        {/* Selected Items */}
        <div class="flex flex-wrap gap-1">
          <For each={props.values}>
            {(value) => (
              <span class="bg-primary pointer-events-auto hover:bg-primaryH duration-200 transition-colors rounded-md text-primaryText fill-primaryText hover:fill-error px-2 py-0.5 flex items-center text-sm focus:outline-none">
                {value.label}
                <button
                  type="button"
                  class="ml-1 duration-200 transition-colors rounded-full focus:outline-none focus:ring-1 ring-error focus:fill-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setValues(
                      props.values.filter((v) => v.value !== value.value)
                    );
                  }}
                >
                  <FaSolidXmark size={16} class="" />
                  <span class="sr-only">Remove</span>
                </button>
              </span>
            )}
          </For>
        </div>
        {/* Icons */}
        <div class="flex items-center ml-2.5">
          <Show when={props.values.length > 0}>
            <button
              type="button"
              class="bg-primary pointer-events-auto h-5 w-5 flex items-center justify-center rounded-full mr-1 fill-primaryText hover:bg-error hover:fill-white duration-200 transition-colors focus:outline-none focus:ring-1 ring-error focus:fill-error"
              onClick={() => {
                setValues([]);
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Backspace" ||
                  e.key === "Delete" ||
                  e.key === "Enter" ||
                  e.key === " "
                ) {
                  setValues([]);
                }
              }}
            >
              <FaSolidXmark size={14} />
              <span class="sr-only">Remove All</span>
            </button>
          </Show>
          <FaSolidSort size={16} class="fill-title ml-1" />
        </div>
      </div>
      {/* Select */}
      <DropdownMenu.Root
        sameWidth={true}
        open={open()}
        onOpenChange={setOpen}
        flip={true}
        gutter={5}
      >
        <DropdownMenu.Trigger
          class={classnames(
            "flex flex-col border rounded-md bg-backgroundAccent transition-colors duration-200 ease-in-out relative w-full group focus:outline-none focus:border-secondary focus:bg-backgroundAccentH",
            {
              "border-error": props.errors?.message !== undefined,
            }
          )}
        >
          <label
            for={props.id}
            class={
              "block pt-2 px-2.5 text-sm transition-colors duration-200 ease-in-out group-focus:text-secondaryH text-left"
            }
          >
            {props.copy.label}
            <Show when={props.required}>
              <span class="text-error ml-1 inline">*</span>
            </Show>
          </label>
          {/* Fake content */}
          <div
            class="w-full mt-1"
            style={{
              height: `${height()}px`,
            }}
          ></div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            class="bg-primary max-h-36 overflow-y-auto p-2.5 shadow-md animate-animate-dropdown focus:outline-none focus:ring-2 ring-secondary rounded-md"
            style={{
              width: "var(--kb-popper-anchor-width)",
            }}
          >
            <ul class="flex flex-col">
              <For each={props.options}>
                {(option) => (
                  <li
                    class="flex items-center justify-between text-base text-primaryText hover:bg-secondaryH hover:text-secondaryText px-2.5 py-1 rounded-md cursor-pointer focus:outline-none focus:bg-secondaryH focus:text-secondaryText"
                    onClick={() => {
                      toggleValue(option);
                    }}
                  >
                    <span>{option.label}</span>
                    <Show
                      when={props.values.find((v) => v.value === option.value)}
                    >
                      <FaSolidCheck size={14} class="fill-primaryText mr-2" />
                    </Show>
                  </li>
                )}
              </For>
            </ul>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Described By */}
      <Show when={props.copy.describedBy !== undefined}>
        <div
          id={`${props.id}-description`}
          class="text-sm mt-2.5 border-l-4 border-secondary pl-2.5"
        >
          {props.copy.describedBy}
        </div>
      </Show>

      {/* Errors */}
      <Show when={props.errors?.message !== undefined}>
        <a class="mt-2.5 flex items-center text-sm" href={`#${props.id}`}>
          <FaSolidTriangleExclamation size={16} class="fill-error mr-2" />
          {props.errors?.message}
        </a>
      </Show>
    </div>
  );
};

export default SelectMultiple;
