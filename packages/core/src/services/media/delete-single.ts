// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Media from "@db/models/Media";
// Services
import medias from "@services/media";
import s3 from "@services/s3";

export interface ServiceData {
  key: string;
}

const deleteSingle = async (data: ServiceData) => {
  const media = await Media.deleteSingle(data.key);

  if (!media) {
    throw new LucidError({
      type: "basic",
      name: "Media not found",
      message: "Media not found",
      status: 404,
    });
  }

  await s3.deleteFile({
    key: media.key,
  });
  // update storage used
  await medias.setStorageUsed({
    add: 0,
    minus: media.file_size,
  });

  return medias.format(media);
};

export default deleteSingle;
