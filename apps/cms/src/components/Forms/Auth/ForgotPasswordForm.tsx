import { type Component, createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
// Components
import Form from "@/components/Groups/Form";
// Hooks
import Mutations from "@/hooks/mutations";

interface ForgotPasswordFormProps {
  showBackToLogin?: boolean;
}

const ForgotPasswordForm: Component<ForgotPasswordFormProps> = (props) => {
  // ----------------------------------------
  // State
  const [email, setEmail] = createSignal("");

  // ----------------------------------------
  // Mutations
  const forgotPassword = Mutations.Auth.useForgotPassword({
    onSuccess: () => {
      setEmail("");
    },
  });

  // ----------------------------------------
  // Render
  return (
    <Form.Root
      type="standard"
      state={{
        isLoading: forgotPassword.action.isLoading,
        errors: forgotPassword.errors(),
      }}
      content={{
        submit: "Send password reset",
      }}
      onSubmit={() => {
        forgotPassword.action.mutate({ email: email() });
      }}
    >
      <Form.Input
        id="email"
        name="email"
        type="email"
        value={email()}
        onChange={setEmail}
        copy={{
          label: "Email",
        }}
        required={true}
        autoFoucs={true}
        errors={forgotPassword.errors()?.errors?.body?.email}
      />
      <Show when={props.showBackToLogin}>
        <Link
          class="block text-sm mt-1 hover:text-secondaryH duration-200 transition-colors"
          type="button"
          href="/login"
        >
          Back to login
        </Link>
      </Show>
    </Form.Root>
  );
};

export default ForgotPasswordForm;
