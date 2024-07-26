import resend from "@/services/resend";

import TemplateEmailContact from "@/templates/email/Contact";

import { typeContact } from "@/types/form";

const inquiry = {
	async general(formData: typeContact) {
		// switch to 'resend.general' when your domain is configured
		const { data, error } = await resend.onboarding.emails.send({
			/**
			 * add and verify a production domain in resend dashboard
			 * replace 'onboarding@resend.dev' below with the intended sender email
			 * 'NEXT_EMAIL_INFO' as defined in the '.env' files
			 */
			from: `${formData.fname} ${formData.lname} <${"onboarding@resend.dev"}>`,
			to: [process.env.NEXT_EMAIL_INFO as string],
			// cc:[]
			subject: formData.subject,
			react: TemplateEmailContact(formData),
			reply_to: formData.email,
		});

		if (!error) {
			return data;
		} else {
			console.error("x-> Error sending general inquiry email:", (error as Error).message);
			throw error;
		}
	},
};

export default inquiry;
