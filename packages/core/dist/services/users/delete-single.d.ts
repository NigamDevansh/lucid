import { PoolClient } from "pg";
export interface ServiceData {
    user_id: number;
}
declare const deleteSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../../../types/src/users").UserResT>;
export default deleteSingle;
//# sourceMappingURL=delete-single.d.ts.map