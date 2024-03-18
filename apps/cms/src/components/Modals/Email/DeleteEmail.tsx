import T from "@/translations";
import { Component, Accessor } from "solid-js";
// Components
import Modal from "@/components/Groups/Modal";
// Services
import api from "@/services/api";

interface DeleteEmailProps {
	id: Accessor<number | undefined>;
	state: {
		open: boolean;
		setOpen: (_open: boolean) => void;
	};
}

const DeleteEmail: Component<DeleteEmailProps> = (props) => {
	// ----------------------------------------
	// Mutations
	const deleteEmail = api.email.useDeleteSingle({
		onSuccess: () => {
			props.state.setOpen(false);
		},
	});

	// ------------------------------
	// Render
	return (
		<Modal.Confirmation
			state={{
				open: props.state.open,
				setOpen: props.state.setOpen,
				isLoading: deleteEmail.action.isPending,
				isError: deleteEmail.action.isError,
			}}
			content={{
				title: T("delete_email_modal_title"),
				description: T("delete_email_modal_description"),
				error: deleteEmail.errors()?.message,
			}}
			onConfirm={() => {
				const id = props.id();
				if (!id) return console.error("No id provided");
				deleteEmail.action.mutate({
					id: id,
				});
			}}
			onCancel={() => {
				props.state.setOpen(false);
				deleteEmail.reset();
			}}
		/>
	);
};

export default DeleteEmail;
