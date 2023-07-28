// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import bricksSchema from "@schemas/bricks";
// Services
import brickConfigService from "@services/brick-config";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof bricksSchema.config.getAll.params,
  typeof bricksSchema.config.getAll.body,
  typeof bricksSchema.config.getAll.query
> = async (req, res, next) => {
  try {
    const bricks = await service(
      brickConfigService.getAll,
      false
    )({
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: bricks,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: bricksSchema.config.getAll,
  controller: getAllController,
};
