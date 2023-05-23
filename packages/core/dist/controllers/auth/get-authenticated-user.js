"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("@services/controllers/build-response"));
const User_1 = __importDefault(require("@db/models/User"));
const body = zod_1.default.object({});
const query = zod_1.default.object({});
const params = zod_1.default.object({});
const getAuthenticatedUser = async (req, res, next) => {
    try {
        const user = await User_1.default.getById(req.auth.id);
        res.status(200).json((0, build_response_1.default)(req, {
            data: user,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: {
        body,
        query,
        params,
    },
    controller: getAuthenticatedUser,
};
//# sourceMappingURL=get-authenticated-user.js.map