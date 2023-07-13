"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const PageCategory_1 = __importDefault(require("../../db/models/PageCategory"));
const verifyCategoriesInCollection = async (data) => {
    const pageCategories = await PageCategory_1.default.getMultiple(data.category_ids, data.collection_key);
    if (pageCategories.length !== data.category_ids.length) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Found",
            message: "Category not found.",
            status: 404,
            errors: (0, error_handler_1.modelErrors)({
                id: {
                    code: "not_found",
                    message: "Category not found.",
                },
                collection_key: {
                    code: "not_found",
                    message: "Collection key not found.",
                },
            }),
        });
    }
    return pageCategories;
};
exports.default = verifyCategoriesInCollection;
//# sourceMappingURL=verify-cateogies-in-collection.js.map