import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface Params {
  key: string;
}

const deleteSingle = (params: Params) => {
  return request<APIResponse<EnvironmentResT>>({
    url: `/api/v1/environments/${params.key}`,
    csrf: true,
    config: {
      method: "DELETE",
    },
  });
};

export default deleteSingle;
