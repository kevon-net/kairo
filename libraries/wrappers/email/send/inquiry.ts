import resend from "@/libraries/resend";
import { Contact } from "@/types/form";
import TemplateEmailContact from "@/components/email/contact";
import { isProduction } from "@/utilities/helpers/environment";

export const emailSendInquiry = async (params: Contact) => {
	// switch to 'resend.general' when your domain is configured
	const { data, error } = await resend.general.emails.send({
		from: `${params.fname} ${params.lname} <"${
			isProduction() ? process.env.NEXT_EMAIL_INFO! : process.env.NEXT_RESEND_EMAIL!
		}">`,
		to: [process.env.NEXT_EMAIL_INFO!],
		subject: params.subject,
		react: TemplateEmailContact(params),
		replyTo: params.email
	});

	if (!error) {
		return data;
	} else {
		console.error("---> wrapper error - (email send inquiry):", error);
		throw error;
	}
};
