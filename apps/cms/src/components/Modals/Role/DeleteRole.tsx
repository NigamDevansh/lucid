import T from "@/translations";
import { Component, Accessor } from "solid-js";
// Components
import Modal from "@/components/Groups/Modal";
// Services
import api from "@/services/api";

interface DeleteRoleProps {
	id: Accessor<number | undefined>;
	state: {
		open: boolean;
		setOpen: (_open: boolean) => void;
	};
}

const DeleteRole: Component<DeleteRoleProps> = (props) => {
	// ----------------------------------------
	// Mutations
	const deleteRole = api.roles.useDeleteSingle({
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
				isLoading: deleteRole.action.isPending,
				isError: deleteRole.action.isError,
			}}
			content={{
				title: T("delete_role_modal_title"),
				description: T("delete_role_modal_description"),
				error: deleteRole.errors()?.message,
			}}
			onConfirm={() => {
				const id = props.id();
				if (!id) return console.error("No id provided");
				deleteRole.action.mutate({
					id: id,
				});
			}}
			onCancel={() => {
				props.state.setOpen(false);
				deleteRole.reset();
			}}
		/>
	);
};

export default DeleteRole;
