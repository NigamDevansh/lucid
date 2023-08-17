import { createSignal, onCleanup } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// Types
import { APIErrorResponse, APIResponse } from "@/types/api";

interface Params {
  email: string;
}

export const sendPasswordResetReq = (params: Params) => {
  return request<
    APIResponse<{
      message: string;
    }>
  >({
    url: `/api/v1/auth/reset-password`,
    csrf: true,
    config: {
      method: "POST",
      body: params,
    },
  });
};

interface UseForgotPasswordProps {
  onSuccess?: () => void;
}

const useForgotPassword = (props: UseForgotPasswordProps) => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  // ----------------------------------------
  // Queries / Mutations
  const sendPasswordReset = createMutation({
    mutationFn: sendPasswordResetReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: "Password reset email sent",
          message: "Please check your email for a password reset link",
          status: "success",
        });
        setErrors(undefined);
        props.onSuccess?.();
      } else if (error) {
        validateSetError(error, setErrors);
      }
    },
  });

  // ----------------------------------------
  // On Cleanup
  onCleanup(() => {
    setErrors(undefined);
  });

  // ----------------------------------------
  // Return
  return {
    action: sendPasswordReset,
    errors: errors,
  };
};

export default useForgotPassword;