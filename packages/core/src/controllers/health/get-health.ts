import z from "zod";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({
  include: z.string().optional(),
  exclude: z.string().optional(),
  filter: z.object({}).optional(),
  sort: z.string().optional(),
});
const params = z.object({});
// --------------------------------------------------
// Controller
const getHealth: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    res.status(200).json({
      health: {
        api: "ok",
        db: "ok",
      },
    });
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: {
    body,
    query,
    params,
  },
  controller: getHealth,
};
