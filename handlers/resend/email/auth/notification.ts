import contact from "@/data/contact";
import resend from "@/services/resend";

import TemplateEmailNofificationChanged from "@/templates/email/notification/Changed";

const notification = {
	async passwordChanged(values: { email: string }) {
		// switch to 'resend.general' when your domain is configured
		const { data, error } = await resend.onboarding.emails.send({
			/**
			 * add and verify a production domain in resend dashboard
			 * replace 'onboarding@resend.dev' below with the intended sender email
			 * 'NEXT_EMAIL_NOREPLY' as defined in the '.env' files
			 */
			from: `${contact.name.company} <${"onboarding@resend.dev"}>`,
			/**
			 * add and verify a production domain in resend dashboard
			 * replace 'devokrann@gmail.com' below with 'values.email'
			 */
			to: ["devokrann@gmail.com"],
			// cc:[]
			subject: `Password Changed`,
			react: TemplateEmailNofificationChanged(),
			// reply_to: formData.email,
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
