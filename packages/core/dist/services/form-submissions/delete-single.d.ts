export interface ServiceData {
    id: number;
    form_key: string;
    environment_key: string;
}
declare const deleteSingle: (data: ServiceData) => Promise<import("../../utils/forms/format-form").FormSubmissionResT>;
export default deleteSingle;
//# sourceMappingURL=delete-single.d.ts.map