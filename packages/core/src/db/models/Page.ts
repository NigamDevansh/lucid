import client from "@db/db";
import { Request } from "express";
import slugify from "slugify";
// Models
import PageCategory from "@db/models/PageCategory";
import Collection from "@db/models/Collection";
import BrickData, { BrickObject } from "@db/models/BrickData";
// Serivces
import formatPage from "@services/pages/format-page";
// Utils
import { LucidError } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";

// -------------------------------------------
// Types
interface QueryParamsGetMultiple extends ModelQueryParams {
  filter?: {
    collection_key?: string;
    title?: string;
    slug?: string;
    category_id?: string | Array<string>;
  };
  sort?: Array<{
    key: "created_at";
    value: "asc" | "desc";
  }>;
  page?: string;
  per_page?: string;
}

interface QueryParamsGetSingle extends ModelQueryParams {
  include?: Array<"bricks">;
}

// Methods
type PageGetMultiple = (req: Request) => Promise<{
  data: PageT[];
  count: number;
}>;

type PageGetSingle = (id: string, req: Request) => Promise<PageT>;

type PageCreate = (
  data: {
    title: string;
    slug: string;
    collection_key: string;
    homepage?: boolean;
    excerpt?: string;
    published?: boolean;
    parent_id?: number;
    category_ids?: Array<number>;
  },
  req: Request
) => Promise<PageT>;

type PageUpdate = (
  id: string,
  data: {
    title?: string;
    slug?: string;
    homepage?: boolean;
    parent_id?: number;
    category_ids?: Array<number>;
    published?: boolean;
    excerpt?: string;
    bricks?: Array<BrickObject>;
  },
  req: Request
) => Promise<PageT>;

// -------------------------------------------
// User
export type PageT = {
  id: number;
  environment_key: string;
  parent_id: number | null;
  collection_key: string;

  title: string;
  slug: string;
  full_slug: string;
  homepage: boolean;
  excerpt: string | null;
  categories?: Array<number> | null;
  bricks?: Array<BrickData> | null;

  published: boolean;
  published_at: string | null;
  published_by: number | null;

  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export default class Page {
  // -------------------------------------------
  // Methods
  static getMultiple: PageGetMultiple = async (req) => {
    const { filter, sort, page, per_page } =
      req.query as QueryParamsGetMultiple;

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
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
        "published_by",
        "created_by",
        "created_at",
        "updated_at",
      ],
      exclude: undefined,
      filter: {
        data: {
          ...filter,
          environment_key: req.headers["lucid-environment"] as string,
        },
        meta: {
          collection_key: {
            operator: "=",
            type: "string",
            columnType: "standard",
          },
          title: {
            operator: "ILIKE",
            type: "string",
            columnType: "standard",
          },
          slug: {
            operator: "ILIKE",
            type: "string",
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
            type: "string",
            columnType: "standard",
          },
        },
      },
      sort: sort,
      page: page,
      per_page: per_page,
    });

    // Get Pages
    const pages = await client.query<PageT>({
      text: `SELECT
          ${SelectQuery.query.select},
          COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${SelectQuery.query.where}
        GROUP BY lucid_pages.id
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
      values: SelectQuery.values,
    });

    const count = await client.query<{ count: number }>({
      text: `SELECT 
          COUNT(DISTINCT lucid_pages.id)
        FROM
          lucid_pages
        LEFT JOIN 
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${SelectQuery.query.where}
        `,
      values: SelectQuery.countValues,
    });

    // format pages
    pages.rows.forEach((page) => {
      page = formatPage(page);
    });

    return {
      data: pages.rows,
      count: count.rows[0].count,
    };
  };
  static getSingle: PageGetSingle = async (id, req) => {
    const { include } = req.query as QueryParamsGetSingle;

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
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
        "published_by",
        "created_by",
        "created_at",
        "updated_at",
      ],
      exclude: undefined,
      filter: {
        data: {
          id: id,
          environment_key: req.headers["lucid-environment"] as string,
        },
        meta: {
          id: {
            operator: "=",
            type: "int",
            columnType: "standard",
          },
          environment_key: {
            operator: "=",
            type: "string",
            columnType: "standard",
          },
        },
      },
      sort: undefined,
      page: undefined,
      per_page: undefined,
    });

    const page = await client.query<PageT>({
      text: `SELECT
        ${SelectQuery.query.select}
        FROM
          lucid_pages
        ${SelectQuery.query.where}`,
      values: SelectQuery.values,
    });

    if (page.rows.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "Page not found",
        message: `Page with id "${id}" not found`,
        status: 404,
      });
    }

    if (include && include.includes("bricks")) {
      const pageBricks = await BrickData.getAll("page", page.rows[0].id);
      page.rows[0].bricks = pageBricks;
    }

    return formatPage(page.rows[0]);
  };
  static create: PageCreate = async (data, req) => {
    // -------------------------------------------
    // Values
    // Set parent id to null if homepage as homepage has to be root level
    const parentId = data.homepage ? undefined : data.parent_id || undefined;

    // -------------------------------------------
    // Checks
    // Check if the collection exists and is the correct type and the same environment
    await Collection.findCollection(
      data.collection_key,
      "pages",
      req.headers["lucid-environment"] as string
    );

    // Check if the the parent_id is the homepage
    await Page.#checkParentNotHomepage({
      parent_id: data.parent_id || null,
      environment_key: req.headers["lucid-environment"] as string,
    });

    // Check if the parent is in the same collection
    if (parentId) {
      await Page.#isParentSameCollection({
        parent_id: parentId,
        collection_key: data.collection_key,
        environment_key: req.headers["lucid-environment"] as string,
      });
    }
    // Check if slug is unique
    const slug = await Page.#slugUnique({
      slug: data.slug,
      homepage: data.homepage || false,
      environment_key: req.headers["lucid-environment"] as string,
      collection_key: data.collection_key,
      parent_id: parentId,
    });

    // -------------------------------------------
    // Create page
    const page = await client.query<PageT>({
      text: `INSERT INTO lucid_pages (environment_key, title, slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [
        req.headers["lucid-environment"],
        data.title,
        slug,
        data.homepage || false,
        data.collection_key,
        data.excerpt || null,
        data.published || false,
        parentId,
        req.auth.id,
      ],
    });

    if (!page.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Page Not Created",
        message: "There was an error creating the page",
        status: 500,
      });
    }

    if (data.category_ids) {
      await PageCategory.create({
        page_id: page.rows[0].id,
        category_ids: data.category_ids,
        collection_key: data.collection_key,
      });
    }

    // Reset homepages
    if (data.homepage) {
      await Page.#resetHomepages({
        current: page.rows[0].id,
        environment_key: req.headers["lucid-environment"] as string,
      });
    }

    return formatPage(page.rows[0]);
  };
  static update: PageUpdate = async (id, data, req) => {
    const pageId = parseInt(id);

    // -------------------------------------------
    // Checks
    const currentPageRes = await client.query<PageT>({
      text: `SELECT
          id,
          parent_id,
          collection_key,
          title,
          slug,
          homepage,
          excerpt,
          published
        FROM
          lucid_pages
        WHERE
          id = $1`,
      values: [id],
    });
    const currentPage = currentPageRes.rows[0];
    if (!currentPage) {
      throw new LucidError({
        type: "basic",
        name: "Page not found",
        message: `Page with id "${id}" not found`,
        status: 404,
      });
    }

    // Set parent id to null if homepage as homepage has to be root level
    const parentId = data.homepage ? undefined : data.parent_id || undefined;

    // Check if the the parent_id is the homepage
    await Page.#checkParentNotHomepage({
      parent_id: data.parent_id || null,
      environment_key: req.headers["lucid-environment"] as string,
    });
    // Check if the parent is in the same collection
    if (parentId) {
      await Page.#isParentSameCollection({
        parent_id: parentId,
        collection_key: currentPage.collection_key,
        environment_key: req.headers["lucid-environment"] as string,
      });
    }

    // -------------------------------------------
    // Set Data

    let newSlug = undefined;
    if (data.slug) {
      // Check if slug is unique
      newSlug = await Page.#slugUnique({
        slug: data.slug,
        homepage: data.homepage || false,
        environment_key: req.headers["lucid-environment"] as string,
        collection_key: currentPage.collection_key,
        parent_id: parentId,
      });
    }

    const { columns, aliases, values } = queryDataFormat(
      [
        "title",
        "slug",
        "excerpt",
        "published",
        "published_at",
        "published_by",
        "parent_id",
        "homepage",
      ],
      [
        data.title,
        newSlug,
        data.excerpt,
        data.published,
        data.published ? new Date() : null,
        data.published ? req.auth.id : null,
        parentId,
        data.homepage,
      ],
      {
        hasValues: {
          updated_at: new Date().toISOString(),
        },
      }
    );

    // -------------------------------------------
    // Update page
    const page = await client.query<PageT>({
      text: `UPDATE lucid_pages SET ${columns.formatted.update} WHERE id = $${
        aliases.value.length + 1
      } RETURNING *`,
      values: [...values.value, pageId],
    });

    if (!page.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Page Not Updated",
        message: "There was an error updating the page",
        status: 500,
      });
    }

    // -------------------------------------------
    // Update categories
    if (data.category_ids) {
      const categories = await PageCategory.update({
        page_id: page.rows[0].id,
        category_ids: data.category_ids,
        collection_key: currentPage.collection_key,
      });
      page.rows[0].categories = categories.map(
        (category) => category.category_id
      );
    }

    // -------------------------------------------
    // Update/Create Bricks
    const brickPromises =
      data.bricks?.map((brick, index) =>
        BrickData.createOrUpdate(brick, index, "page", pageId)
      ) || [];
    const pageBricksIds = await Promise.all(brickPromises);

    // -------------------------------------------
    // Delete unused bricks
    if (data.bricks) {
      await BrickData.deleteUnused("page", pageId, pageBricksIds);
    }

    return formatPage(page.rows[0]);
  };
  // -------------------------------------------
  // Util Methods
  static #slugUnique = async (data: {
    slug: string;
    homepage: boolean;
    environment_key: string;
    collection_key: string;
    parent_id?: number;
  }) => {
    // For homepage, return "/"
    if (data.homepage) {
      return "/";
    }

    // Sanitize slug with slugify
    data.slug = slugify(data.slug, { lower: true, strict: true });

    const values: Array<any> = [
      data.slug,
      data.collection_key,
      data.environment_key,
    ];
    if (data.parent_id) values.push(data.parent_id);

    const slugCount = await client.query<{ count: number }>({
      // where slug is like, slug-example, slug-example-1, slug-example-2
      text: `SELECT COUNT(*) 
        FROM 
          lucid_pages 
        WHERE slug ~ '^${data.slug}-\\d+$' 
        OR 
          slug = $1
        AND
          collection_key = $2
        AND
          environment_key = $3
        ${data.parent_id ? `AND parent_id = $4` : `AND parent_id IS NULL`}`,
      values: values,
    });

    if (slugCount.rows[0].count >= 1) {
      return `${data.slug}-${slugCount.rows[0].count}`;
    } else {
      return data.slug;
    }
  };
  static #checkParentNotHomepage = async (data: {
    parent_id: number | null;
    environment_key: string;
  }) => {
    if (!data.parent_id) return;
    const values: Array<any> = [data.environment_key];
    if (data.parent_id) values.push(data.parent_id);

    const parent = await client.query<{ homepage: boolean }>({
      text: `SELECT homepage 
        FROM 
          lucid_pages 
        WHERE
          environment_key = $1
        AND 
          id = $2`,
      values: values,
    });
    if (parent.rows[0].homepage) {
      throw new LucidError({
        type: "basic",
        name: "Homepage Parent",
        message: "The homepage cannot be set as a parent!",
        status: 400,
      });
    }
  };
  static #isParentSameCollection = async (data: {
    parent_id: number;
    collection_key: string;
    environment_key: string;
  }) => {
    // Check if the parent is apart of the same collection
    const parent = await client.query<{ collection_key: string }>({
      text: `SELECT collection_key FROM lucid_pages WHERE id = $1 AND environment_key = $2`,
      values: [data.parent_id, data.environment_key],
    });

    if (!parent.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Parent Not Found",
        message: "The parent page could not be found!",
        status: 404,
      });
    }

    if (parent.rows[0].collection_key !== data.collection_key) {
      throw new LucidError({
        type: "basic",
        name: "Parent Collection Mismatch",
        message:
          "The parent page must be in the same collection as the page you are creating!",
        status: 400,
      });
    }
  };
  static #resetHomepages = async (data: {
    current: number;
    environment_key: string;
  }) => {
    // reset homepage, set its parent to null and its full slug to slugified title
    const result = await client.query({
      text: `SELECT id, title FROM lucid_pages WHERE homepage = true AND id != $1 AND environment_key = $2`,
      values: [data.current, data.environment_key],
    });

    for (const row of result.rows) {
      let newSlug = slugify(row.title, { lower: true, strict: true });
      const slugExists = await client.query({
        text: `SELECT COUNT(*) FROM lucid_pages WHERE slug = $1 AND id != $2 AND environment_key = $3`,
        values: [newSlug, row.id, data.environment_key],
      });

      if (slugExists.rows[0].count > 0) {
        newSlug += `-${row.id}`;
      }

      await client.query({
        text: `UPDATE lucid_pages SET homepage = false, parent_id = null, slug = $2 WHERE id = $1`,
        values: [row.id, newSlug],
      });
    }
  };
}
