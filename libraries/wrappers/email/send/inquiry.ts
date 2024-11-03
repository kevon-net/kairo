import resend from "@/libraries/resend";
import TemplateEmailContact from "@/components/email/contact";
import { isProduction } from "@/utilities/helpers/environment";
import { EmailInquiry } from "@/types/email";

export const emailCreateInquiry = async (options: EmailInquiry) => {
	// switch to 'resend.general' when your domain is configured
	const { data, error } = await resend.general.emails.send({
		from: `${options.from.name} <${
			isProduction() ? process.env.NEXT_EMAIL_INFO! : process.env.NEXT_RESEND_EMAIL!
		}>`,
		to: [process.env.NEXT_EMAIL_INFO!],
		subject: options.subject,
		react: TemplateEmailContact(options),
		replyTo: options.from.email,
	});

	if (!error) {
		return data;
	} else {
		console.error("---> wrapper error - (create (send) email inquiry):", error);
		throw error;
	}
};
