import resend from "@/services/resend";

import TemplateEmailContact from "@/templates/email/Contact";

import { typeContact } from "@/types/form";

const inquiry = {
	async general(formData: typeContact) {
		// switch to 'resend.general' when your domain is configured
		const { data, error } = await resend.onboarding.emails.send({
			// include & verify domain in dashboard before replacing it with "onboarding@resend.dev"
			from: `${formData.fname} ${formData.lname} <onboarding@resend.dev>`,
			to: ["kevon.kibochi@outlook.com"],
			subject: formData.subject,
			react: TemplateEmailContact(formData),
			reply_to: formData.email,
			// cc:[]
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
