import contact from "@/data/contact";
import resend from "@/services/resend";

import TemplateEmailCodeSignUp from "@/templates/email/code/SignUp";
import TemplateEmailCodeForgot from "@/templates/email/code/Forgot";

const code = {
	async signUp(value: { otp: string; email: string }) {
		// switch to 'resend.general' when your domain is configured
		const { data, error } = await resend.onboarding.emails.send({
			// include & verify domain in dashboard before replacing it with "onboarding@resend.dev"
			from: `${contact.name.app} <onboarding@resend.dev>`,
			// replace 'devokrann@gmail.com' with user's email after verifying domain
			to: "devokrann@gmail.com" /** value.email */,
			subject: `Verify Your Email Address`,
			react: TemplateEmailCodeSignUp(value.otp),
			// reply_to: formData.email,
			// cc:[]
		});
		if (!error) {
			return data;
		} else {
			console.error("x-> Error emailing sign up code:", (error as Error).message);
			throw error;
		}
	},

	async forgotPassword(value: { otl: string; email: string }) {
		// switch to 'resend.general' when your domain is configured
		const { data, error } = await resend.onboarding.emails.send({
			// include & verify domain in dashboard before replacing it with "onboarding@resend.dev"
			from: `${contact.name.app} <onboarding@resend.dev>`,
			// replace 'devokrann@gmail.com' with user's email after verifying domain
			to: "devokrann@gmail.com" /** value.email */,
			subject: `Reset Your Password`,
			react: TemplateEmailCodeForgot(value.otl),
			// reply_to: formData.email,
			// cc:[]
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
