import T from "../../translations/index.js";
import type z from "zod";
import type { ErrorResult, LucidErrorData } from "../../types/errors.js";

/**
 * The LucidAPIError class should be used to throw errors within the API request lifecycle. This will be caught by Fastify's error handler and will return a formatted error response. If the error is a Zod error, it will be formatted into a more readable format.
 * @class
 * @extends Error
 * @param {LucidErrorData} error
 * @returns {void}
 * @example
 * throw new LucidAPIError({
 *    type: "basic",
 *    name: "Fetch User Error",
 *    message: "Error while fetching user data",
 *    status: 500,
 * });
 * @example
 * throw new LucidAPIError({
 *    type: "validation",
 *    name: "Validation Error",
 *    message: "Validation error occurred",
 *    status: 400,
 *    errorResponse: {
 *        body: {
 *            email: {
 *                code: "invalid_email",
 *                message: "Invalid email address",
 *            },
 *        },
 *    },
 * });
 */
class LucidAPIError extends Error {
	error: LucidErrorData;
	constructor(error: LucidErrorData) {
		super(error.message);
		this.error = error;

		if (error.zod !== undefined) {
			this.error.errorResponse = LucidAPIError.formatZodErrors(
				error.zod?.issues || [],
			);
		}

		switch (error.type) {
			case "validation": {
				this.error.status = 400;
				if (error.name === undefined) this.name = T("validation_error");
				break;
			}
			case "authorisation": {
				this.error.status = 401;
				if (error.name === undefined)
					this.name = T("authorisation_error");
				break;
			}
			case "forbidden": {
				this.error.status = 403;
				if (error.name === undefined) this.name = T("forbidden_error");
				break;
			}
			default: {
				if (error.status === undefined) this.error.status = 500;
				break;
			}
		}
	}
	// static
	static formatZodErrors(error: z.ZodIssue[]) {
		const result: ErrorResult = {};

		for (const item of error) {
			let current = result;
			for (const key of item.path) {
				if (typeof key === "number") {
					// @ts-expect-error
					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					current = current.children || (current.children = []);
					// @ts-expect-error
					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					current = current[key] || (current[key] = {});
				} else {
					// @ts-expect-error
					// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					current = current[key] || (current[key] = {});
				}
			}
			current.code = item.code;
			current.message = item.message;
		}

		return result ?? undefined;
	}
}

export default LucidAPIError;
