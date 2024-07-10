import contact from "@/data/contact";
import resend from "@/services/resend";

import TemplateEmailNofificationChanged from "@/templates/email/notification/Changed";

const notification = {
	async passwordChanged(email: string) {
		// switch to 'resend.general' when your domain is configured
		const { data, error } = await resend.onboarding.emails.send({
			// include & verify domain in dashboard before replacing it with "onboarding@resend.dev"
			from: `${contact.name.app} <onboarding@resend.dev>`,
			// replace 'devokrann@gmail.com' with user's email after verifying domain
			to: "devokrann@gmail.com" /** value.email */,
			subject: `Password Changed`,
			react: TemplateEmailNofificationChanged(),
			// reply_to: formData.email,
			// cc:[]
		});
		if (!error) {
			return data;
		} else {
			console.error("x-> Error emailing password change notification:", (error as Error).message);
			throw error;
		}
	},
};

export default notification;
