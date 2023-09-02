/// <reference types="node" />
import fileUpload from "express-fileupload";
import { type MediaMetaDataT } from "../../utils/media/helpers";
export interface ServiceData {
    type: "file" | "buffer";
    key: string;
    file?: fileUpload.UploadedFile;
    buffer?: Buffer;
    meta: MediaMetaDataT;
}
declare const saveObject: (data: ServiceData) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default saveObject;
//# sourceMappingURL=save-object.d.ts.map