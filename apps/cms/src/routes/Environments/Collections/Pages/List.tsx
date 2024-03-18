import T from "@/translations";
import { useParams } from "@solidjs/router";
import { Component, createMemo, createSignal } from "solid-js";
// Services
import api from "@/services/api";
// Store
import userStore from "@/store/userStore";
import { environment } from "@/store/environmentStore";
// Types
import { CollectionResT } from "@headless/types/src/collections";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Componetns
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";
import PagesTable from "@/components/Tables/PagesTable";
import CreateUpdatePagePanel from "@/components/Panels/Pages/CreateUpdatePagePanel";

const EnvCollectionsPagesListRoute: Component = () => {
	// ----------------------------------
	// State & Hooks
	const params = useParams();
	const searchParams = useSearchParams(
		{
			filters: {
				title: {
					value: "",
					type: "text",
				},
				slug: {
					value: "",
					type: "text",
				},
				category_id: {
					value: [],
					type: "array",
				},
			},
			sorts: {
				created_at: "desc",
			},
		},
		{
			singleSort: true,
		},
	);
	const [getOpenCreatePanel, setOpenCreatePanel] = createSignal(false);

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);

	// ----------------------------------
	// Queries
	const collection = api.environment.collections.useGetSingle({
		queryParams: {
			location: {
				collection_key: collectionKey,
			},
			headers: {
				"headless-environment": environment,
			},
		},
		enabled: () => !!collectionKey(),
	});

	const categories = api.environment.collections.categories.useGetMultiple({
		queryParams: {
			filters: {
				collection_key: collectionKey,
			},
			headers: {
				"headless-environment": environment,
			},
			perPage: -1,
		},
		enabled: () => !!collectionKey(),
	});

	// ----------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={collection.data?.data.title}
			description={collection.data?.data.description || ""}
			options={{
				noBorder: true,
			}}
			state={{
				isLoading: collection.isLoading,
				isError: collection.isError,
				isSuccess: collection.isSuccess,
			}}
			actions={{
				create: {
					open: getOpenCreatePanel(),
					setOpen: setOpenCreatePanel,
					permission: userStore.get.hasEnvPermission(
						["create_content"],
						environment() || "",
					).all,
					label: T("create_dynamic", {
						name: collection.data?.data.singular || "",
					}),
				},
				contentLanguage: true,
			}}
			headingChildren={
				<Query.Row
					searchParams={searchParams}
					filters={[
						{
							label: T("title"),
							key: "title",
							type: "text",
						},
						{
							label: T("slug"),
							key: "slug",
							type: "text",
						},
						{
							label: T("category"),
							key: "category_id",
							type: "multi-select",
							options:
								categories.data?.data.map((cat) => ({
									label: cat.title,
									value: String(cat.id),
								})) || [],
						},
					]}
					sorts={[
						{
							label: T("created_at"),
							key: "created_at",
						},
					]}
					perPage={[]}
				/>
			}
		>
			<PagesTable
				searchParams={searchParams}
				collection={collection.data?.data as CollectionResT}
			/>
			<CreateUpdatePagePanel
				state={{
					open: getOpenCreatePanel(),
					setOpen: setOpenCreatePanel,
				}}
				collection={collection.data?.data as CollectionResT}
			/>
		</Layout.PageLayout>
	);
};

export default EnvCollectionsPagesListRoute;
