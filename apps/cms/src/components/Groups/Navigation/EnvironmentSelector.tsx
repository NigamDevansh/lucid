import { Component, createMemo } from "solid-js";
import { DropdownMenu } from "@kobalte/core";
import { FaSolidChevronRight } from "solid-icons/fa";
// State
import { environment } from "@/state/environment";
// Types
import { EnvironmentResT } from "@lucid/types/src/environments";
// Components

interface EnvironmentSelectorProps {
  environments: EnvironmentResT[];
}

const EnvironmentSelector: Component<EnvironmentSelectorProps> = (props) => {
  // ----------------------------------
  // Memos
  const environmentData = createMemo(() => {
    return props.environments.find((env) => env.key === environment());
  });

  // ----------------------------------
  // Render
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="relative h-[60px] w-full bg-white border-b border-border mb-[15px] flex items-center justify-between px-[15px]">
        <span class="text-title font-medium">{environmentData()?.title}</span>
        <FaSolidChevronRight class="fill-title" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="bg-backgroundAccent w-[240px] p-[15px] shadow-md">
          <p>hello</p>
          <button>Create environment</button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default EnvironmentSelector;