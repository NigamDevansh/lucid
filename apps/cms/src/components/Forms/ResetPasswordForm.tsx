import { type Component, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
// Utils
import spawnToast from "@/utils/spawn-toast";
import { validateSetError } from "@/utils/error-handling";
// Service
import api from "@/services/api";
// Components
import Form from "@/components/Partials/Form";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Partials/Button";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: Component<ResetPasswordFormProps> = (props) => {
  // ----------------------------------------
  // State
  const navigate = useNavigate();

  const [errors, setErrors] = createSignal<APIErrorResponse>();

  const [password, setPassword] = createSignal("");
  const [passwordConfirmation, setPasswordConfirmation] = createSignal("");

  // ----------------------------------------
  // Queries / Mutations
  const resetPassword = createMutation({
    mutationFn: api.auth.resetPassword,
    onSuccess: () => {
      spawnToast({
        title: "Password Reset",
        message: "Your password has been reset successfully",
        status: "success",
      });
      navigate("/login");
    },
    onError: (error) => validateSetError(error, setErrors),
  });

  // ----------------------------------------
  // Render
  return (
    <Form
      onSubmit={async () => {
        resetPassword.mutate({
          token: props.token,
          password: password(),
          password_confirmation: passwordConfirmation(),
        });
      }}
    >
      <Input
        id="password"
        name="password"
        type="password"
        value={password()}
        onChange={setPassword}
        copy={{
          label: "Password",
        }}
        required={true}
        autoFoucs={true}
        errors={errors()?.errors?.body?.password}
      />
      <Input
        id="password_confirmation"
        name="password_confirmation"
        type="password"
        value={passwordConfirmation()}
        onChange={setPasswordConfirmation}
        copy={{
          label: "Confirm Password",
        }}
        required={true}
        errors={errors()?.errors?.body?.password_confirmation}
      />
      <div class="mt-10 w-full">
        <Button
          loading={resetPassword.isLoading}
          classes="w-full"
          type="submit"
          colour="primary"
        >
          Reset Password
        </Button>
      </div>
    </Form>
  );
};

export default ResetPasswordForm;