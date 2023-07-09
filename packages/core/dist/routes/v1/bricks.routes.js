"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../../utils/app/route"));
const get_all_1 = __importDefault(require("../../controllers/brick-config/get-all"));
const get_single_1 = __importDefault(require("../../controllers/brick-config/get-single"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/config/:collection_key/all",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: get_all_1.default.schema,
    controller: get_all_1.default.controller,
});
(0, route_1.default)(router, {
    method: "get",
    path: "/config/:collection_key/:brick_key",
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
        validateEnvironment: true,
    },
    schema: get_single_1.default.schema,
    controller: get_single_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=bricks.routes.js.map