import appData from "@/data/app";
import resend from "@/libraries/resend";

import TemplateEmailCodeSignUp from "@/components/email/auth/sign-up";
import { isProduction } from "@/utilities/helpers/environment";

export const emailSendSignUp = async (params: { otp: string; email: string }) => {
	const { data, error } = await resend.general.emails.send({
		from: `${appData.name.app} <"${
			isProduction() ? process.env.NEXT_EMAIL_NOREPLY! : process.env.NEXT_RESEND_EMAIL!
		}">`,
		to: [isProduction() ? params.email : process.env.NEXT_EMAIL_NOREPLY!],
		subject: `Verify Your Email Address`,
		react: TemplateEmailCodeSignUp(params.otp),
		replyTo: process.env.NEXT_EMAIL_NOREPLY!
	});
	if (!error) {
		return data;
	} else {
		console.error("---> wrapper error - (email send sign up):", error);
		throw error;
	}
};
