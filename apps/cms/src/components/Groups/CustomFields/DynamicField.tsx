import { Component, For, Match, Switch, Show } from "solid-js";
// Types
import { CustomFieldT } from "@lucid/types/src/bricks";
// Store
import { BrickStoreGroupT, BrickStoreFieldT } from "@/store/builderStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";
import FieldTypeIcon from "@/components/Partials/FieldTypeIcon";

interface DynamicFieldProps {
  data: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    field: CustomFieldT;
    activeTab?: string;
    group_id?: BrickStoreFieldT["group_id"];

    repeater?: {
      parent_group_id: BrickStoreGroupT["parent_group_id"];
      repeater_depth: number;
    };
  };
}

export const DynamicField: Component<DynamicFieldProps> = (props) => {
  // -------------------------------
  // Render
  return (
    <div class="flex w-full mb-2.5 last:mb-0">
      <Show when={props.data.field.type !== "tab"}>
        <FieldTypeIcon type={props.data.field.type} />
      </Show>
      <div class="w-full">
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
                      repeater: props.data.repeater,
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
                repeater: {
                  parent_group_id: props.data.repeater?.parent_group_id || null,
                  repeater_depth: props.data.repeater?.repeater_depth || 0,
                },
              }}
            />
          </Match>
          <Match when={props.data.field.type === "text"}>
            <CustomFields.TextField
              data={{
                type: props.data.type,
                brickIndex: props.data.brickIndex,
                key: props.data.field.key,
                field: props.data.field,
                group_id: props.data.group_id,
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
      </div>
    </div>
  );
};