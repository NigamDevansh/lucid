"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const getMultiple = async (data) => {
    const menus = await Menu_1.default.getMultiple(data.query, {
        environment_key: data.environment_key,
    });
    return menus;
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map