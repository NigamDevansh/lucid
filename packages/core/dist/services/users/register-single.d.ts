export interface ServiceData {
    email: string;
    username: string;
    password: string;
    super_admin?: boolean;
}
declare const registerSingle: (data: ServiceData) => Promise<import("../users").UserResT>;
export default registerSingle;
//# sourceMappingURL=register-single.d.ts.map