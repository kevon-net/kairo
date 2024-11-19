import appData from "@/data/app";
import resend from "@/libraries/resend";

import TemplateEmailCodeForgot from "@/components/email/auth/password-forgot";
import TemplateEmailNofificationChanged from "@/components/email/auth/password-changed";
import { isProduction } from "@/utilities/helpers/environment";
import { EmailInquiry } from "@/types/email";
import { render } from "@react-email/render";

export const emailCreatePasswordForgot = async (otl: string, options: EmailInquiry["to"]) => {
	const { data, error } = await resend.general.emails.send({
		from: `${appData.name.app} <${
			isProduction() ? process.env.NEXT_EMAIL_NOREPLY! : process.env.NEXT_RESEND_EMAIL!
		}>`,
		to: [isProduction() ? options : process.env.NEXT_EMAIL_NOREPLY!],
		subject: "Reset Your Password",
		html: await render(TemplateEmailCodeForgot({ otl })),
		replyTo: process.env.NEXT_EMAIL_NOREPLY!,
	});
	if (!error) {
		return data;
	} else {
		console.error("---> wrapper error - (email create (send) password forgot):", error);

		throw error;
	}
};

export const emailCreatePasswordChanged = async (options: EmailInquiry["to"]) => {
	const { data, error } = await resend.general.emails.send({
		from: `${appData.name.app} <${
			isProduction() ? process.env.NEXT_EMAIL_NOREPLY! : process.env.NEXT_RESEND_EMAIL!
		}>`,
		to: [isProduction() ? options : process.env.NEXT_EMAIL_NOREPLY!],
		subject: `Password Changed`,
		html: await render(TemplateEmailNofificationChanged()),
		replyTo: process.env.NEXT_EMAIL_NOREPLY!,
	});
	if (!error) {
		return data;
	} else {
		console.error("---> wrapper error - (email create (send) password changed):", error);

		throw error;
	}
};
