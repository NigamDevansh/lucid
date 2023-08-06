import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";
import { UserResT } from "@lucid/types/src/users";

interface Params {
  username: string;
  password: string;
}

const login = (params: Params) => {
  return request<APIResponse<UserResT>>({
    url: `/api/v1/auth/login`,
    csrf: true,
    config: {
      method: "POST",
      body: params,
    },
  });
};

export default login;
