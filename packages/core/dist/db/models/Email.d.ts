import z from "zod";
import emailsSchema from "../../schemas/email";
type EmailCreateSingle = (data: {
    from_address?: string;
    from_name?: string;
    to_address?: string;
    subject?: string;
    cc?: string;
    bcc?: string;
    template: string;
    delivery_status: "sent" | "failed" | "pending";
    data?: {
        [key: string]: any;
    };
}) => Promise<EmailT>;
type EmailGetMultiple = (query: z.infer<typeof emailsSchema.getMultiple.query>) => Promise<{
    data: EmailT[];
    count: number;
}>;
type EmailUpdateSingle = (id: number, data: {
    from_address?: string;
    from_name?: string;
    delivery_status?: "sent" | "failed" | "pending";
}) => Promise<EmailT>;
type EmailGetSingle = (id: number) => Promise<EmailT>;
type EmailDeleteSingle = (id: number) => Promise<EmailT>;
type EmailResendSingle = (id: number) => Promise<{
    email: EmailT;
    status: {
        success: boolean;
        message: string;
    };
}>;
export type EmailT = {
    id: number;
    from_address: string | null;
    from_name: string | null;
    to_address: string | null;
    subject: string | null;
    cc: string | null;
    bcc: string | null;
    delivery_status: "sent" | "failed" | "pending";
    template: string;
    data?: {
        [key: string]: any;
    };
    created_at: string;
    updated_at: string;
    html?: string;
};
export default class Email {
    static createSingle: EmailCreateSingle;
    static getMultiple: EmailGetMultiple;
    static getSingle: EmailGetSingle;
    static deleteSingle: EmailDeleteSingle;
    static updateSingle: EmailUpdateSingle;
    static resendSingle: EmailResendSingle;
}
export {};
//# sourceMappingURL=Email.d.ts.map