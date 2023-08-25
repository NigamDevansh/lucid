import { createEffect, createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Store
import userStore from "@/store/userStore";
// Utils
import request from "@/utils/request";
// Types
import { UserResT } from "@lucid/types/src/users";
import { APIResponse } from "@/types/api";

interface QueryParams {}

const useGetAuthenticatedUser = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {};
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  const query = createQuery(
    () => ["users.getSingle", queryKey(), params.key?.()],
    {
      queryFn: () =>
        request<APIResponse<UserResT>>({
          url: `/api/v1/auth/me`,
          config: {
            method: "GET",
          },
        }),
      get enabled() {
        return params.enabled ? params.enabled() : true;
      },
    }
  );

  createEffect(() => {
    if (query.isSuccess) {
      userStore.set("user", query.data.data);
    }
  });

  return query;
};

export default useGetAuthenticatedUser;