import { type FastifyInstance } from "fastify";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema.js";
import { type HeadlessConfigT } from "../schemas/config.js";

declare module "fastify" {
	interface FastifyInstance {
		db: DB;
		config: HeadlessConfigT;
	}
}

declare global {
	type DB = PostgresJsDatabase<typeof schema>;

	type ControllerT<ParamsT, BodyT, QueryT> = (
		request: FastifyRequest<{
			Params: z.infer<ParamsT>;
			Body: z.infer<BodyT>;
			Querystring: z.infer<QueryT>;
			server: FastifyInstance;
		}>,
		reply: FastifyReply,
	) => void;

	type ServiceT<DataT> = (
		fastify: FastifyInstance,
		data: DataT,
	) => Promise<unknown>;

	interface ResponseBodyT {
		data: Array<unknown> | { [key: string]: unknown } | undefined | null;
		links?: {
			first: string | null;
			last: string | null;
			next: string | null;
			prev: string | null;
		};
		meta: {
			links?: Array<{
				active: boolean;
				label: string;
				url: string | null;
				page: number;
			}>;
			path: string;

			current_page?: number | null;
			last_page?: number | null;
			per_page?: number | null;
			total?: number | null;
		};
	}
}
