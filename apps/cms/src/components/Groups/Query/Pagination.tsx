import { Component, createMemo, createSignal } from "solid-js";
import { FaSolidChevronLeft, FaSolidChevronRight } from "solid-icons/fa";
// Types
import { APIResponse } from "@/types/api";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Components
import Layout from "@/components/Groups/Layout";
import { Pagination as KobPagination } from "@kobalte/core";

interface PaginationProps {
  meta?: APIResponse<any>["meta"];
  searchParams: ReturnType<typeof useSearchParams>;
}

export const Pagination: Component<PaginationProps> = (props) => {
  const [page, setPage] = createSignal(props.meta?.current_page || 1);

  // -------------------------------------
  // Memos
  const textData = createMemo(() => {
    /*
    path: string;
    links: Array<{}>;
    current_page: number | null;
    per_page: number | null;
    total: number | null;
    last_page: number | null;
    */
    const { meta } = props;

    return {
      page: meta?.current_page || 1,
      lastPage: meta?.last_page || 1,
      total: meta?.total || 1,
    };
  });

  // -------------------------------------
  // Render
  return (
    <Layout.PageFooter>
      <div class="flex md:flex-row flex-col justify-between md:items-center">
        <span class="text-sm text-body md:mb-0 mb-2">
          Showing {textData().page} to {textData().lastPage} of{" "}
          {textData().total} results
        </span>
        <KobPagination.Root
          class="flex [&>ul]:flex [&>ul]:border [&>ul]:border-border [&>ul]:rounded-md [&>ul]:overflow-hidden"
          page={page()}
          onPageChange={(page) => {
            props.searchParams.setParams({
              pagination: {
                page: page,
              },
            });
            setPage(page);
          }}
          count={props.meta?.last_page || 1}
          itemComponent={(props) => (
            <KobPagination.Item
              class="h-10 w-10 flex items-center justify-center [&[data-current]]:bg-primary [&[data-current]]:text-primaryText hover:bg-primary hover:text-primaryText duration-200 transition-colors"
              page={props.page}
            >
              {props.page}
            </KobPagination.Item>
          )}
          ellipsisComponent={() => (
            <KobPagination.Ellipsis class="h-10 w-10 flex items-center justify-center">
              ...
            </KobPagination.Ellipsis>
          )}
        >
          <KobPagination.Previous class="h-10 w-10 flex items-center justify-center fill-title hover:bg-primary hover:fill-primaryText duration-200 transition-colors disabled:opacity-50">
            <FaSolidChevronLeft />
          </KobPagination.Previous>
          <KobPagination.List />
          <KobPagination.Next class="h-10 w-10 flex items-center justify-center fill-title hover:bg-primary hover:fill-primaryText duration-200 transition-colors disabled:opacity-50">
            <FaSolidChevronRight />
          </KobPagination.Next>
        </KobPagination.Root>
      </div>
    </Layout.PageFooter>
  );
};
