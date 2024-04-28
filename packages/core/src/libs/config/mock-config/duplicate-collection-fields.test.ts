import { expect, test, vi } from "vitest";
import T from "../../../translations/index.js";
import path from "node:path";
import getConfig from "../get-config.js";
import logger from "../../logging/logger.js";
import { messageFormat, LoggerScopes } from "../../logging/index.js";

test("should throw duplicate collection field key error", async () => {
	const consoleLogSpy = vi
		.spyOn(logger, "error")
		// @ts-expect-error
		.mockImplementation(() => {});

	const processExitSpy = vi
		.spyOn(process, "exit")
		// @ts-expect-error
		.mockImplementation(() => {});

	await getConfig(
		path.resolve(__dirname, "./duplicate-collection-fields.ts"),
	);

	expect(consoleLogSpy).toHaveBeenCalledWith(
		messageFormat({
			scope: LoggerScopes.CONFIG,
			message: T("duplicate_field_keys_message", {
				type: "collection",
				keys: ["title"].join(", "),
				typeKey: "page",
			}),
		}),
		undefined,
	);
	expect(processExitSpy).toHaveBeenCalledWith(1);
	processExitSpy.mockRestore();
	consoleLogSpy.mockRestore();
});