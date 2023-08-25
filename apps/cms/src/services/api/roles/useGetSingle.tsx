import { createMemo, Accessor } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import helpers from "@/utils/helpers";
// Types
import { RoleResT } from "@lucid/types/src/roles";
import { APIResponse } from "@/types/api";

interface QueryParams {
  location: {
    role_id: Accessor<number | undefined>;
  };
}

const useGetSingle = (params: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {
      location: {
        role_id: helpers.resolveValue(params.queryParams?.location?.role_id),
      },
    };
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(() => ["roles.getSingle", queryKey(), params.key?.()], {
    queryFn: () =>
      request<APIResponse<RoleResT>>({
        url: `/api/v1/roles/${queryParams().location.role_id}`,
        config: {
          method: "GET",
        },
      }),
    get enabled() {
      return params.enabled ? params.enabled() : true;
    },
  });
};

export default useGetSingle;