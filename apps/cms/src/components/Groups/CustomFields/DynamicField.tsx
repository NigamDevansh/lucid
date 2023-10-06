import { Component, For, Match, Switch, Show } from "solid-js";
// Types
import { CustomFieldT } from "@lucid/types/src/bricks";
// Components
import CustomFields from "@/components/Groups/CustomFields";

interface DynamicFieldProps {
  data: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    field: CustomFieldT;
    repeater?: string;
    group?: number[];
    activeTab?: string;

    depth?: number;
  };
}

export const DynamicField: Component<DynamicFieldProps> = (props) => {
  // -------------------------------
  // Render
  return (
    <Switch>
      <Match when={props.data.field.type === "tab"}>
        <Show when={props.data.activeTab === props.data.field.key}>
          <For each={props.data.field.fields}>
            {(field) => (
              <DynamicField
                data={{
                  type: props.data.type,
                  brickIndex: props.data.brickIndex,
                  field: field,
                }}
              />
            )}
          </For>
        </Show>
      </Match>
      <Match when={props.data.field.type === "repeater"}>
        <CustomFields.RepeaterGroup
          data={{
            type: props.data.type,
            brickIndex: props.data.brickIndex,
            field: props.data.field,
            depth: props.data.depth || 0,
            group: props.data.group || [],
          }}
        />
      </Match>
      <Match when={props.data.field.type === "text"}>
        <CustomFields.TextField
          data={{
            type: props.data.type,
            brickIndex: props.data.brickIndex,
            key: props.data.field.key,
            repeater: props.data.repeater,
            group: props.data.group,
            field: props.data.field,
          }}
        />
      </Match>
      <Match when={props.data.field.type === "wysiwyg"}>
        <div>wysiwyg</div>
      </Match>
      <Match when={props.data.field.type === "media"}>
        <div>media</div>
      </Match>
      <Match when={props.data.field.type === "number"}>
        <div>number</div>
      </Match>
      <Match when={props.data.field.type === "checkbox"}>
        <div>checkbox</div>
      </Match>
      <Match when={props.data.field.type === "select"}>
        <div>select</div>
      </Match>
      <Match when={props.data.field.type === "textarea"}>
        <div>textarea</div>
      </Match>
      <Match when={props.data.field.type === "json"}>
        <div>json</div>
      </Match>
      <Match when={props.data.field.type === "colour"}>
        <div>colour</div>
      </Match>
      <Match when={props.data.field.type === "datetime"}>
        <div>datetime</div>
      </Match>
      <Match when={props.data.field.type === "pagelink"}>
        <div>pagelink</div>
      </Match>
      <Match when={props.data.field.type === "link"}>
        <div>link</div>
      </Match>
    </Switch>
  );
};
