import { Router } from "express";
import r from "@utils/app/route";
// Controller
import updateSingle from "@controllers/single-pages/update-single";
import getSingle from "@controllers/single-pages/get-single";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "patch",
  path: "/:collection_key",
  permissions: {
    environments: ["update_content"],
  },
  middleware: {
    authenticate: true,
    authoriseCSRF: true,
    validateEnvironment: true,
  },
  schema: updateSingle.schema,
  controller: updateSingle.controller,
});

r(router, {
  method: "get",
  path: "/:collection_key",
  permissions: {
    environments: ["read_content"],
  },
  middleware: {
    authenticate: true,
    validateEnvironment: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
