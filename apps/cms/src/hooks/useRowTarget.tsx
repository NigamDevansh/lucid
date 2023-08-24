/*
    To avoid each row containing modals and panels, this is a helper hook to allow the modals to site on the level above and
    register the targeted row and update an open state for the specific modal or panel.
*/
import { createSignal } from "solid-js";

interface UseRowTargetProps {
  triggers: Record<string, boolean>;
}

const useRowTarget = (config: UseRowTargetProps) => {
  const [getTriggers, setTriggers] = createSignal(config.triggers);
  const [getTargetId, setTargetId] = createSignal<number>();

  return {
    getTriggers,
    setTrigger: (key: string, state: boolean) => {
      if (state === false) setTargetId(undefined);
      setTriggers((prev) => {
        return {
          ...prev,
          [key]: state,
        };
      });
    },
    getTargetId,
    setTargetId,
  };
};

export default useRowTarget;
