// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import rolesSchema from "@schemas/roles";
// Services
import getSingle from "@services/roles/get-single";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof rolesSchema.getSingle.params,
  typeof rolesSchema.getSingle.body,
  typeof rolesSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const role = await getSingle({
      id: parseInt(req.params.id),
    });

    res.status(200).json(
      buildResponse(req, {
        data: role,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: rolesSchema.getSingle,
  controller: getSingleController,
};
