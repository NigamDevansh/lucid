import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                post_type_id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                title: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                post_type_id?: string | string[] | undefined;
                title?: string | undefined;
            }, {
                post_type_id?: string | string[] | undefined;
                title?: string | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["title", "created_at"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "desc" | "asc";
                key: "title" | "created_at";
            }, {
                value: "desc" | "asc";
                key: "title" | "created_at";
            }>, "many">>;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                post_type_id?: string | string[] | undefined;
                title?: string | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "title" | "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            filter?: {
                post_type_id?: string | string[] | undefined;
                title?: string | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "title" | "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        filter: z.ZodOptional<z.ZodObject<{
            post_type_id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            title: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            post_type_id?: string | string[] | undefined;
            title?: string | undefined;
        }, {
            post_type_id?: string | string[] | undefined;
            title?: string | undefined;
        }>>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodEnum<["title", "created_at"]>;
            value: z.ZodEnum<["asc", "desc"]>;
        }, "strip", z.ZodTypeAny, {
            value: "desc" | "asc";
            key: "title" | "created_at";
        }, {
            value: "desc" | "asc";
            key: "title" | "created_at";
        }>, "many">>;
        page: z.ZodOptional<z.ZodString>;
        per_page: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        filter?: {
            post_type_id?: string | string[] | undefined;
            title?: string | undefined;
        } | undefined;
        sort?: {
            value: "desc" | "asc";
            key: "title" | "created_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }, {
        filter?: {
            post_type_id?: string | string[] | undefined;
            title?: string | undefined;
        } | undefined;
        sort?: {
            value: "desc" | "asc";
            key: "title" | "created_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-multiple.d.ts.map