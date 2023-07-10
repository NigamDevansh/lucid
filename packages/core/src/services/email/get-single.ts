// Models
import Email from "@db/models/Email";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Services
import emails from "@services/email";

export interface ServiceData {
  id: number;
}

const getSingle = async (data: ServiceData) => {
  const email = await Email.getSingle(data.id);

  if (!email) {
    throw new LucidError({
      type: "basic",
      name: "Email",
      message: "Email not found",
      status: 404,
    });
  }

  const html = await emails.renderTemplate(email.template, email.data || {});
  email.html = html;

  return email;
};

export default getSingle;