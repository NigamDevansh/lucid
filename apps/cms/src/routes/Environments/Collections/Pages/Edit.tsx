import T from "@/translations/index";
import {
  Component,
  createSignal,
  createMemo,
  createEffect,
  Show,
} from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import shortUUID from "short-uuid";
import { FaSolidTrash } from "solid-icons/fa";
// Services
import api from "@/services/api";
// Stores
import { environment } from "@/store/environmentStore";
import builderStore from "@/store/builderStore";
// Types
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import { CollectionResT } from "@lucid/types/src/collections";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";
import AddBrick from "@/components/Modals/Bricks/AddBrick";
import Button from "@/components/Partials/Button";
import DeletePage from "@/components/Modals/Pages/DeletePage";
import ContentLanguageSelect from "@/components/Partials/ContentLanguageSelect";

const EnvCollectionsPagesEditRoute: Component = () => {
  // ------------------------------
  // Hooks
  const params = useParams();
  const navigate = useNavigate();

  // ------------------------------
  // State
  const [getParentId, setParentId] = createSignal<number | undefined>(
    undefined
  );
  const [getIsHomepage, setIsHomepage] = createSignal<boolean>(false);
  const [getSelectedCategories, setSelectedCategories] = createSignal<
    SelectMultipleValueT[]
  >([]);
  const [getSelectedAuthor, setSelectedAuthor] = createSignal<
    number | undefined
  >(undefined);

  // Modals
  const [getSelectBrickOpen, setSelectBrickOpen] = createSignal(false);
  const [getDeleteOpen, setDeleteOpen] = createSignal(false);

  // ----------------------------------
  // Memos
  const pageId = createMemo(() => Number(params.id));
  const collectionKey = createMemo(() => params.collectionKey);

  // ----------------------------------
  // Queries
  const categories = api.environment.collections.categories.useGetMultiple({
    queryParams: {
      filters: {
        collection_key: collectionKey,
      },
      headers: {
        "lucid-environment": environment,
      },
      perPage: -1,
    },
    enabled: () => !!collectionKey(),
  });
  const collection = api.environment.collections.useGetSingle({
    queryParams: {
      location: {
        collection_key: collectionKey,
      },
      headers: {
        "lucid-environment": environment,
      },
    },
    enabled: () => !!collectionKey(),
  });
  const page = api.environment.collections.pages.useGetSingle({
    queryParams: {
      location: {
        id: pageId(),
      },
      includes: {
        bricks: false,
      },
      headers: {
        "lucid-environment": environment,
      },
    },
    enabled: () => !!pageId(),
  });
  const brickConfig = api.brickConfig.useGetAll({
    queryParams: {
      include: {
        fields: true,
      },
      filters: {
        collection_key: collectionKey,
        environment_key: environment,
      },
    },
  });

  const isLoading = createMemo(() => {
    return (
      categories.isLoading ||
      collection.isLoading ||
      page.isLoading ||
      brickConfig.isLoading
    );
  });

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (page.isSuccess && categories.isSuccess && collection.isSuccess) {
      builderStore.get.reset();

      setParentId(page.data?.data.parent_id || undefined);
      setIsHomepage(page.data?.data.homepage || false);
      setSelectedCategories(
        categories.data?.data
          .filter((cat) => {
            return page.data?.data.categories?.includes(cat.id);
          })
          ?.map((cat) => {
            return {
              value: cat.id,
              label: cat.title,
            };
          }) || []
      );
      setSelectedAuthor(page.data?.data.author?.id || undefined);

      // TODO: add better solution for this
      // Set fixed
      builderStore.set(
        "bricks",
        collection.data.data.bricks
          .filter((brick) => brick.type === "fixed")
          .map((brick, i) => {
            return {
              id: `temp-${shortUUID.generate()}}`,
              key: brick.key,
              fields: [],
              groups: [],
              type: "fixed",
              order: i,
              position: (brick.position === "top" ? "top" : "bottom") as
                | "top"
                | "bottom",
            };
          })
      );
    }
  });

  // ----------------------------------
  // Render
  return (
    <>
      <header class="h-[60px] w-full bg-container border-b border-border px-15 md:px-30 flex items-center justify-between">
        <h1 class="text-unfocused font-normal text-xl">
          #{page.data?.data.id}
        </h1>

        <div class="flex items-center gap-2.5">
          <div class="min-w-[250px]">
            <ContentLanguageSelect />
          </div>
          <Button
            type="button"
            theme="primary"
            size="small"
            onClick={() => alert("save page")}
          >
            {T("save", {
              singular: collection.data?.data.singular || "",
            })}
          </Button>
          <Button
            theme="danger"
            size="icon"
            type="button"
            onClick={() => setDeleteOpen(true)}
          >
            <span class="sr-only">{T("delete")}</span>
            <FaSolidTrash />
          </Button>
        </div>
      </header>
      <div class="relative h-[calc(100vh-60px)] w-full flex">
        {/* Inputs */}
        <div class="w-[500px] max-h-screen overflow-y-auto p-15 md:p-30">
          <PageBuilder.Sidebar
            data={{
              pageId: pageId(),
              collection: collection.data?.data,
              categories: categories.data?.data || [],
            }}
            state={{
              getParentId,
              setParentId,
              getIsHomepage,
              setIsHomepage,
              getSelectedCategories,
              setSelectedCategories,
              getSelectedAuthor,
              setSelectedAuthor,
            }}
          />
        </div>
        {/* Build */}
        <div class="h-full w-full p-15 pl-0">
          <div class="w-full h-[calc(100%-59px)] bg-primary rounded-md brick-pattern relative">
            <div class="absolute inset-0 overflow-y-scroll z-10 right-[195px] p-15">
              <PageBuilder.Builder
                data={{
                  brickConfig: brickConfig.data?.data || [],
                }}
                state={{
                  setOpenSelectBrick: () => {
                    setSelectBrickOpen(true);
                    // setTargetOrder(order);
                  },
                }}
              />
            </div>
            <div class="absolute top-15 right-15 bottom-15 w-[180px] p-2 bg-white bg-opacity-20 rounded-md z-20 overflow-y-scroll">
              <PageBuilder.PreviewBar
                data={{
                  brickConfig: brickConfig.data?.data || [],
                }}
              />
            </div>
          </div>
          <div class="w-full mt-15">
            <Button
              type="button"
              theme="primary"
              size="small"
              onClick={() => {
                setSelectBrickOpen(true);
              }}
              classes="w-full"
            >
              {T("add_brick")}
            </Button>
          </div>
        </div>
      </div>
      <Show when={!isLoading()}>
        {/* Modals */}
        <AddBrick
          state={{
            open: getSelectBrickOpen(),
            setOpen: setSelectBrickOpen,
          }}
          data={{
            collection: collection.data?.data,
            brickConfig: brickConfig.data?.data || [],
          }}
        />
        <DeletePage
          id={page.data?.data.id}
          state={{
            open: getDeleteOpen(),
            setOpen: setDeleteOpen,
          }}
          collection={collection.data?.data as CollectionResT}
          callbacks={{
            onSuccess: () => {
              navigate(
                `/env/${environment()}/collection/${collection.data?.data.key}`
              );
            },
          }}
        />
      </Show>
    </>
  );
};

export default EnvCollectionsPagesEditRoute;
