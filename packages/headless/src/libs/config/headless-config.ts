import { ZodError } from "zod";
import { log } from "console-log-colors";
import checks from "./checks/index.js";
import ConfigSchema, { type Config } from "./config-schema.js";
import { CollectionConfigSchema } from "../collection-builder/index.js";
import { BrickSchema, FieldsSchema } from "../brick-builder-new/index.js";

const headlessConfig = (config: Config) => {
	try {
		const configRes = ConfigSchema.parse(config) as Config;

		checks.checkDuplicateBuilderKeys(
			"bricks",
			config.bricks?.map((b) => b.key),
		);
		checks.checkDuplicateBuilderKeys(
			"collections",
			config.collections?.map((c) => c.data.key),
		);

		if (configRes.collections) {
			for (const collection of configRes.collections) {
				CollectionConfigSchema.parse(collection.config);
			}
		}

		if (configRes.bricks) {
			for (const brick of configRes.bricks) {
				BrickSchema.parse(brick.config);
				for (const field of brick.flatFields) FieldsSchema.parse(field);
				checks.checkDuplicateFieldKeys(brick.key, brick.meta.fieldKeys);
				checks.checkRepeaterDepth(brick.key, brick.meta.repeaterDepth);
			}
		}

		return configRes;
	} catch (err) {
		log.white("-".repeat(60));
		log.yellow("Headless Config Error");
		log.white("-".repeat(60));

		if (err instanceof ZodError) {
			console.table(
				err.errors.map((error) => {
					return {
						path: error.path.join("."),
						message: error.message,
					};
				}),
			);
		} else if (err instanceof Error) {
			log.red(err.message);
		} else {
			log.red("An unexpected error occurred");
		}

		log.white("-".repeat(60));

		process.exit(1);
	}
};

export default headlessConfig;
