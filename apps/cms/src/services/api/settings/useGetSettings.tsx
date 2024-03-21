import { createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { SettingsResT } from "@headless/types/src/settings";
import { APIResponse } from "@/types/api";

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface QueryParams {}

const useGetSettings = (params?: QueryHook<QueryParams>) => {
	const queryParams = createMemo(() =>
		serviceHelpers.getQueryParams<QueryParams>(params?.queryParams || {}),
	);
	const queryKey = createMemo(() =>
		serviceHelpers.getQueryKey(queryParams()),
	);

	// -----------------------------
	// Query
	return createQuery(() => ({
		queryKey: ["settings.getSettings", queryKey(), params?.key?.()],
		queryFn: () =>
			request<APIResponse<SettingsResT>>({
				url: "/api/v1/settings",
				config: {
					method: "GET",
				},
			}),
		get enabled() {
			return params?.enabled ? params.enabled() : true;
		},
	}));
};

export default useGetSettings;
