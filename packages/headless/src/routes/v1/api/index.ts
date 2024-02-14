import { FastifyInstance } from "fastify";
// API
import authRoutes from "./auth.routes.js";
import environmentRoutes from "./environments.routes.js";
import permissionRoutes from "./permissions.routes.js";
import roleRoutes from "./roles.routes.js";
import accountRoutes from "./account.routes.js";
import langaugeRoutes from "./languages.routes.js";
import emailRoutes from "./emails.routes.js";

const routes = async (fastify: FastifyInstance) => {
	fastify.register(authRoutes, {
		prefix: "/auth",
	});
	fastify.register(environmentRoutes, {
		prefix: "/environments",
	});
	fastify.register(permissionRoutes, {
		prefix: "/permissions",
	});
	fastify.register(roleRoutes, {
		prefix: "/roles",
	});
	fastify.register(accountRoutes, {
		prefix: "/account",
	});
	fastify.register(langaugeRoutes, {
		prefix: "/languages",
	});
	fastify.register(emailRoutes, {
		prefix: "/emails",
	});
};

export default routes;
