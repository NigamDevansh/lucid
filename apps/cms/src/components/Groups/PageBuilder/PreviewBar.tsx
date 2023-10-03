import { Component, For, createMemo, Show } from "solid-js";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
import type { DropZoneCBT } from "@/components/Partials/DragDropZone";
// Stores
import builderStore from "@/store/builderStore";
// Components
import BrickPreview from "@/components/Partials/BrickPreview";
import DragDropZone from "@/components/Partials/DragDropZone";
import classNames from "classnames";

interface PreviewBarProps {
  data: {
    brickConfig: BrickConfigT[];
  };
}

export const PreviewBar: Component<PreviewBarProps> = (props) => {
  // ----------------------------------
  // Memos
  const fixedTopBricks = createMemo(() => {
    return builderStore.get.fixedBricks.filter(
      (brick) => brick.position === "top"
    );
  });
  const fixedBottomBricks = createMemo(() => {
    return builderStore.get.fixedBricks.filter(
      (brick) => brick.position === "bottom"
    );
  });

  // ----------------------------------
  // Render
  return (
    <>
      {/* Fixed - Top */}
      <Show when={fixedTopBricks().length > 0}>
        <ul class="mb-2.5">
          <For each={fixedTopBricks()}>
            {(brick, i) => (
              <PreviewBarItem
                type="fixed"
                data={{
                  key: brick.key,
                  brickConfig: props.data.brickConfig,
                  index: i(),
                }}
              />
            )}
          </For>
        </ul>
      </Show>
      {/* Builder */}
      <div>
        <Show when={fixedTopBricks().length > 0}>
          <span class="w-10 h-px bg-white block mx-auto mb-2.5"></span>
        </Show>
        <DragDropZone
          zoneId="builder-preview"
          sortOrder={(index, targetIndex) => {
            builderStore.get.sortOrder({
              type: "builderBricks",
              from: index,
              to: targetIndex,
            });
          }}
        >
          {({ dropZone }) => (
            <ol class="w-full">
              <For each={builderStore.get.builderBricks}>
                {(brick, i) => (
                  <PreviewBarItem
                    type="builder"
                    data={{
                      key: brick.key,
                      brickConfig: props.data.brickConfig,
                      index: i(),
                    }}
                    callbacks={{ dropZone }}
                  />
                )}
              </For>
            </ol>
          )}
        </DragDropZone>
        <Show when={fixedBottomBricks().length > 0}>
          <span class="w-10 h-px bg-white block mx-auto mt-2.5"></span>
        </Show>
      </div>
      {/* Fixed - Bottom */}
      <Show when={fixedBottomBricks().length > 0}>
        <ul class="mt-2.5">
          <For each={fixedBottomBricks()}>
            {(brick, i) => (
              <PreviewBarItem
                type="fixed"
                data={{
                  key: brick.key,
                  brickConfig: props.data.brickConfig,
                  index: i(),
                }}
              />
            )}
          </For>
        </ul>
      </Show>
    </>
  );
};

interface PreviewBarItemProps {
  type: "builder" | "fixed";
  data: {
    key: string;
    brickConfig: BrickConfigT[];
    index: number;
  };
  callbacks?: {
    dropZone?: DropZoneCBT;
  };
}

const PreviewBarItem: Component<PreviewBarItemProps> = (props) => {
  // ------------------------------
  // Memos
  const brickConfig = createMemo(() => {
    return props.data.brickConfig.find((brick) => brick.key === props.data.key);
  });

  // ----------------------------------
  // Render
  return (
    <li
      data-zoneId={props.callbacks?.dropZone?.zoneId}
      class={classNames("mb-2 last:mb-0 transition-opacity duration-200", {
        "opacity-60":
          props.callbacks?.dropZone?.getDraggingIndex() === props.data.index,
        "cursor-grab": props.type === "builder",
      })}
      onDragStart={(e) =>
        props.callbacks?.dropZone?.onDragStart(e, props.data.index)
      }
      onDragEnd={(e) => props.callbacks?.dropZone?.onDragEnd(e)}
      onDragEnter={(e) =>
        props.callbacks?.dropZone?.onDragEnter(e, props.data.index)
      }
      onDragOver={(e) => props.callbacks?.dropZone?.onDragOver(e)}
      draggable={props.type === "builder"}
    >
      <BrickPreview
        data={{
          brick: brickConfig(),
        }}
      />
    </li>
  );
};
