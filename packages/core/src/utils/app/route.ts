import { Router } from "express";
import z from "zod";
// Middleware
import validate from "@middleware/validate.js";
import authenticate from "@middleware/authenticate.js";
import authoriseCSRF from "@middleware/authorise-csrf.js";
import paginated from "@middleware/paginated.js";
import validateEnvironment from "@middleware/validate-environment.js";
import permissions from "@middleware/permissions.js";
import fileUpload from "@middleware/file-upload.js";
import contentLanguage from "@middleware/content-language.js";
// Types
import {
  PermissionT,
  EnvironmentPermissionT,
} from "@lucid/types/src/permissions.js";

type Route = <
  ParamsT extends z.ZodTypeAny,
  BodyT extends z.ZodTypeAny,
  QueryT extends z.ZodTypeAny
>(
  router: Router,
  props: {
    method: "get" | "post" | "put" | "delete" | "patch";
    path: string;
    permissions?: {
      global?: PermissionT[];
      environments?: EnvironmentPermissionT[];
    };
    middleware?: {
      fileUpload?: boolean;
      authenticate?: boolean;
      authoriseCSRF?: boolean;
      paginated?: boolean;
      validateEnvironment?: boolean;
      contentLanguage?: boolean;
    };
    schema?: {
      params?: ParamsT;
      body?: BodyT;
      query?: QueryT;
    };
    controller: Controller<ParamsT, BodyT, QueryT>;
  }
) => Router;

const route: Route = (router, props) => {
  const { method, path, controller } = props;

  // ------------------------------------
  // Assign middleware
  const middleware = [];

  // set middleware for authentication
  if (props.middleware?.authenticate) {
    middleware.push(authenticate);
  }

  // set middleware for authorisation (CSRF)
  if (props.middleware?.authoriseCSRF) {
    middleware.push(authoriseCSRF);
  }

  // set middleware for file upload
  if (props.middleware?.fileUpload) {
    middleware.push(fileUpload);
  }

  // set middleware for validation
  if (props.schema?.params || props.schema?.body || props.schema?.query) {
    middleware.push(
      validate(
        z.object({
          params: props.schema?.params ?? z.object({}),
          query: props.schema?.query ?? z.object({}),
          body: props.schema?.body ?? z.object({}),
        })
      )
    );
  }

  // set middleware for pagination
  if (props.middleware?.paginated) {
    middleware.push(paginated);
  }

  // set middleware for environment validation
  if (props.middleware?.validateEnvironment) {
    middleware.push(validateEnvironment);
  }

  // set middleware for permissions
  if (props.permissions) {
    middleware.push(permissions(props.permissions));
  }

  // set middleware for content language
  if (props.middleware?.contentLanguage) {
    middleware.push(contentLanguage);
  }

  switch (method) {
    case "get":
      router.get(path, middleware, controller);
      break;
    case "post":
      router.post(path, middleware, controller);
      break;
    case "put":
      router.put(path, middleware, controller);
      break;
    case "delete":
      router.delete(path, middleware, controller);
      break;
    case "patch":
      router.patch(path, middleware, controller);
      break;
    default:
      break;
  }

  return router;
};

export default route;
