// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import pagesSchema from "@schemas/pages";
// Services
import pages from "@services/pages";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof pagesSchema.createSingle.params,
  typeof pagesSchema.createSingle.body,
  typeof pagesSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const page = await pages.createSingle({
      environment_key: req.headers["lucid-environment"] as string,
      title: req.body.title,
      slug: req.body.slug,
      collection_key: req.body.collection_key,
      homepage: req.body.homepage,
      excerpt: req.body.excerpt,
      published: req.body.published,
      parent_id: req.body.parent_id,
      category_ids: req.body.category_ids,
      userId: req.auth.id,
    });

    res.status(200).json(
      buildResponse(req, {
        data: page,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.createSingle,
  controller: createSingleController,
};
