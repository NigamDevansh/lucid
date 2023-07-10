"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/app/build-response"));
const media_1 = __importDefault(require("../../schemas/media"));
const media_2 = __importDefault(require("../../services/media"));
const getSingleController = async (req, res, next) => {
    try {
        const media = await media_2.default.getSingle({
            key: req.params.key,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: media,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: media_1.default.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map