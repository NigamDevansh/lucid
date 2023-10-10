import { Component, JSXElement } from "solid-js";
import classNames from "classnames";
// Components
import { Dialog } from "@kobalte/core";

interface ModalProps {
  state: {
    open: boolean;
    setOpen: (_open: boolean) => void;
  };
  options?: {
    noPadding?: boolean;
  };
  children: JSXElement;
}

export const Modal: Component<ModalProps> = (props) => {
  // ------------------------------
  // Render
  return (
    <Dialog.Root
      open={props.state.open}
      onOpenChange={() => props.state.setOpen(!props.state.open)}
    >
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-primary bg-opacity-60 animate-animate-fade-out data-[expanded]:animate-animate-fade-in" />
        <div class="fixed inset-0 z-50 flex items-center justify-center p-15 overflow-y-auto">
          <Dialog.Content class="z-50 max-w-2xl w-full bg-container shadow-md rounded-md border-border border m-auto">
            <div
              class={classNames({
                "p-15 md:p-30": !props.options?.noPadding,
              })}
            >
              {props.children}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};