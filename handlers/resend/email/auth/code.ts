import contact from "@/data/contact";
import resend from "@/services/resend";

import TemplateEmailCodeSignUp from "@/templates/email/code/SignUp";
import TemplateEmailCodeForgot from "@/templates/email/code/Forgot";

const code = {
	async signUp(values: { otp: string; email: string }) {
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
			subject: `Verify Your Email Address`,
			react: TemplateEmailCodeSignUp(values.otp),
			// reply_to: formData.email,
		});
		if (!error) {
			return data;
		} else {
			console.error("x-> Error emailing sign up code:", (error as Error).message);
			throw error;
		}
	},

	async forgotPassword(values: { otl: string; email: string }) {
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
			subject: `Reset Your Password`,
			react: TemplateEmailCodeForgot(values.otl),
			// reply_to: formData.email,
		});
		if (!error) {
			return data;
		} else {
			console.error("x-> Error emailing password reset link:", (error as Error).message);
			throw error;
		}
	},
};

export default code;
