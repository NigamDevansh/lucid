import { PoolClient } from "pg";
import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
// Models
import Page from "@db/models/Page.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Utils
import service from "@utils/app/service.js";
// Services
import collectionsService from "@services/collections/index.js";
// Format
import formatPage from "@utils/format/format-page.js";

export interface ServiceData {
  query: z.infer<typeof pagesSchema.getMultiple.query>;
  environment_key: string;
}

const getMultiple = async (client: PoolClient, data: ServiceData) => {
  const { filter, sort, page, per_page } = data.query;

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "lucid_pages.id",
      "environment_key",
      "collection_key",
      "parent_id",
      "title",
      "slug",
      "full_slug",
      "homepage",
      "excerpt",
      "published",
      "published_at",
      "author_id",
      "created_by",
      "lucid_pages.created_at",
      "lucid_pages.updated_at",
    ],
    exclude: undefined,
    filter: {
      data: {
        ...filter,
        environment_key: data.environment_key,
      },
      meta: {
        collection_key: {
          operator: "=",
          type: "text",
          columnType: "standard",
        },
        title: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
        slug: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
        category_id: {
          operator: "=",
          type: "int",
          columnType: "standard",
          table: "lucid_page_categories",
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard",
        },
      },
    },
    sort: sort,
    page: page,
    per_page: per_page,
  });

  const response = await Promise.all([
    Page.getMultiple(client, SelectQuery),
    service(
      collectionsService.getAll,
      false,
      client
    )({
      query: {},
    }),
  ]);

  return {
    data: response[0].data.map((page) => formatPage(page, response[1])),
    count: response[0].count,
  };
};

export default getMultiple;
