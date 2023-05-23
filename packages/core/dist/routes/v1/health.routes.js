"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("@utils/route"));
const get_health_1 = __importDefault(require("@controllers/health/get-health"));
const router = (0, express_1.Router)();
(0, route_1.default)(router, {
    method: "get",
    path: "/",
    schema: get_health_1.default.schema,
    controller: get_health_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=health.routes.js.map