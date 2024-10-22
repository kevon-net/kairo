import appData from "@/data/app";
import resend from "@/libraries/resend";

import TemplateEmailCodeForgot from "@/app/email/code/forgot";
import TemplateEmailNofificationChanged from "@/app/email/notification/changed";
import { isProduction } from "@/utilities/helpers/environment";

export const emailSendPasswordForgot = async (params: { otl: string; email: string }) => {
	const { data, error } = await resend.general.emails.send({
		from: `${appData.name.app} <"${
			isProduction() ? process.env.NEXT_EMAIL_NOREPLY! : process.env.NEXT_RESEND_EMAIL!
		}">`,
		to: [isProduction() ? params.email : process.env.NEXT_EMAIL_NOREPLY!],
		subject: "Reset Your Password",
		react: TemplateEmailCodeForgot(params.otl),
		replyTo: process.env.NEXT_EMAIL_NOREPLY!
	});
	if (!error) {
		return data;
	} else {
		console.error("---> wrapper error - (email send password forgot):", error);

		throw error;
	}
};

export const emailSendPasswordChanged = async (params: { email: string }) => {
	const { data, error } = await resend.general.emails.send({
		from: `${appData.name.app} <"${
			isProduction() ? process.env.NEXT_EMAIL_NOREPLY! : process.env.NEXT_RESEND_EMAIL!
		}">`,
		to: [isProduction() ? params.email : process.env.NEXT_EMAIL_NOREPLY!],
		subject: `Password Changed`,
		react: TemplateEmailNofificationChanged(),
		replyTo: process.env.NEXT_EMAIL_NOREPLY!
	});
	if (!error) {
		return data;
	} else {
		console.error("---> wrapper error - (email send password changed):", error);

		throw error;
	}
};
