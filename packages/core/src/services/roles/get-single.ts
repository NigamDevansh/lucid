import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Role from "@db/models/Role";
// Format
import formatRole from "@utils/format/format-roles";

export interface ServiceData {
  id: number;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const role = await Role.getSingle(client, {
    id: data.id,
  });

  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error getting the role.",
      status: 500,
    });
  }

  return formatRole(role);
};

export default getSingle;
