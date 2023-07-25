import { createSignal } from "solid-js";
// Types
import { EnvironmentResT } from "@lucid/types/src/environments";

// -------------------------------
// Functions
const setEnvironment = (value: EnvironmentResT["key"] | undefined) => {
  setEnvironmentValue(value);

  if (!value) {
    // remove from local storage
    localStorage.removeItem("lucid_environment");
    return;
  } else {
    // set in local storage
    localStorage.setItem("lucid_environment", value);
  }
};
const getInitialEnvironment = () => {
  const environment = localStorage.getItem("lucid_environment");
  if (environment) {
    return environment as EnvironmentResT["key"];
  }
  return undefined;
};
const syncEnvironment = (environments: EnvironmentResT[]) => {
  if (environments.length === 0) {
    setEnvironment(undefined);
    return;
  }

  // check if environment is already set, verify it exists
  const environmentLS = localStorage.getItem("lucid_environment");
  if (environmentLS) {
    // check if environment exists
    const environmentExists = environments.find(
      (environment) => environment.key === environmentLS
    );
    if (environmentExists !== undefined) {
      setEnvironment(environmentExists.key);
      return;
    }
  }
  setEnvironment(environments[0]?.key || undefined);
};

// -------------------------------
// State
const [environment, setEnvironmentValue] = createSignal<
  EnvironmentResT["key"] | undefined
>(getInitialEnvironment());

export { environment, setEnvironment, syncEnvironment };