// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof pagesSchema.getMultiple.params,
  typeof pagesSchema.getMultiple.body,
  typeof pagesSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const pagesRes = await service(
      pagesService.getMultiple,
      false
    )({
      query: req.query,
      environment_key: req.headers["lucid-environment"] as string,
      language: req.language,
    });

    res.status(200).json(
      buildResponse(req, {
        data: pagesRes.data,
        pagination: {
          count: pagesRes.count,
          page: req.query.page as string,
          per_page: req.query.per_page as string,
        },
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.getMultiple,
  controller: getMultipleController,
};
