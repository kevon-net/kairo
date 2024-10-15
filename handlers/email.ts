import appData from "@/data/app";
import resend from "@/services/resend";

import TemplateEmailCodeSignUp from "@/components/templates/email/code/signUp";
import TemplateEmailCodeForgot from "@/components/templates/email/code/forgot";
import TemplateEmailNofificationChanged from "@/components/templates/email/notification/changed";
import TemplateEmailContact from "@/components/templates/email/contact";

import { Contact } from "@/types/form";

export const sendGeneralInquiryEmail = async (formData: Contact) => {
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
		replyTo: formData.email,
	});

	if (!error) {
		return data;
	} else {
		console.error("x-> Error sending general inquiry email:", (error as Error).message);
		throw error;
	}
};

export const sendSignUpEmail = async (values: { otp: string; email: string }) => {
	// switch to 'resend.general' when your domain is configured
	const { data, error } = await resend.onboarding.emails.send({
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'onboarding@resend.dev' below with the intended sender email
		 * 'NEXT_EMAIL_NOREPLY' as defined in the '.env' files
		 */
		from: `${appData.name.company} <${"onboarding@resend.dev"}>`,
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'devokrann@gmail.com' below with 'values.email'
		 */
		to: ["devokrann@gmail.com"],
		// cc:[]
		subject: `Verify Your Email Address`,
		react: TemplateEmailCodeSignUp(values.otp),
		// replyTo: formData.email,
	});
	if (!error) {
		return data;
	} else {
		console.error("x-> Error emailing sign up code:", (error as Error).message);
		throw error;
	}
};

export const sendForgotPasswordEmail = async (values: { otl: string; email: string }) => {
	// switch to 'resend.general' when your domain is configured
	const { data, error } = await resend.onboarding.emails.send({
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'onboarding@resend.dev' below with the intended sender email
		 * 'NEXT_EMAIL_NOREPLY' as defined in the '.env' files
		 */
		from: `${appData.name.company} <${"onboarding@resend.dev"}>`,
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'devokrann@gmail.com' below with 'values.email'
		 */
		to: ["devokrann@gmail.com"],
		// cc:[]
		subject: `Reset Your Password`,
		react: TemplateEmailCodeForgot(values.otl),
		// replyTo: formData.email,
	});
	if (!error) {
		return data;
	} else {
		console.error("x-> Error emailing password reset link:", (error as Error).message);
		throw error;
	}
};

export const sendPasswordChangedEmail = async (values: { email: string }) => {
	// switch to 'resend.general' when your domain is configured
	const { data, error } = await resend.onboarding.emails.send({
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'onboarding@resend.dev' below with the intended sender email
		 * 'NEXT_EMAIL_NOREPLY' as defined in the '.env' files
		 */
		from: `${appData.name.company} <${"onboarding@resend.dev"}>`,
		/**
		 * add and verify a production domain in resend dashboard
		 * replace 'devokrann@gmail.com' below with 'values.email'
		 */
		to: ["devokrann@gmail.com"],
		// cc:[]
		subject: `Password Changed`,
		react: TemplateEmailNofificationChanged(),
		// replyTo: formData.email,
	});
	if (!error) {
		return data;
	} else {
		console.error("x-> Error emailing password change notification:", (error as Error).message);
		throw error;
	}
};
