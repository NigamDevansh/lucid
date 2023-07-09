"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../utils/controllers/build-response"));
const auth_1 = __importDefault(require("../../schemas/auth"));
const register_superadmin_1 = __importDefault(require("../../services/auth/register-superadmin"));
const registerSuperAdminController = async (req, res, next) => {
    try {
        const user = await (0, register_superadmin_1.default)({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: user,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: auth_1.default.registerSuperAdmin,
    controller: registerSuperAdminController,
};
//# sourceMappingURL=register-superadmin.js.map