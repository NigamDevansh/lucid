import { PoolClient } from "pg";
import { LucidError } from "@utils/app/error-handler";
// Models
import CollectionBrick from "@db/models/CollectionBrick";
// Internal packages
import { CollectionBrickConfigT } from "@lucid/collection-builder";
// Types
import { CollectionResT } from "@lucid/types/src/collections";

export interface ServiceData {
  type: CollectionResT["type"];
  reference_id: number;
  brick_ids: Array<number | undefined>;
  brick_type: CollectionBrickConfigT["type"];
}

const deleteUnused = async (client: PoolClient, data: ServiceData) => {
  const allBricks = await CollectionBrick.getAllBricks(client, {
    type: data.type,
    reference_id: data.reference_id,
    brick_type: data.brick_type,
  });
  const brickIds = allBricks.map((brick) => brick.id);

  // Filter out the bricks that are still in use
  const bricksToDelete = brickIds.filter((id) => !data.brick_ids.includes(id));

  // Delete the bricks
  const promises = bricksToDelete.map((id) =>
    CollectionBrick.deleteSingleBrick(client, {
      brick_id: id,
    })
  );

  try {
    await Promise.all(promises);
  } catch (err) {
    throw new LucidError({
      type: "basic",
      name: "Brick Delete Error",
      message: `There was an error deleting bricks for "${data.type}" of ID "${data.reference_id}"!`,
      status: 500,
    });
  }
};

export default deleteUnused;
