import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";

import EmailMarketingContact from "@/components/email/marketing/contact";
import EmailPasswordChanged from "@/components/email/auth/password-changed";
import EmailPasswordForgot from "@/components/email/auth/password-forgot";
import EmailSignIn from "@/components/email/auth/sign-in";
import EmailSignUp from "@/components/email/auth/sign-up";

import { baseUrl } from "@/data/constants";
import { generateOtpCode } from "@/utilities/generators/otp";
import sample from "@/data/sample";

const emails: Record<string, any> = {
	contact: EmailMarketingContact({ name: "Jane Doe", message: sample.text.prose }),
	passwordChanged: EmailPasswordChanged(),
	passwordForgot: EmailPasswordForgot({ otl: baseUrl }),
	signIn: EmailSignIn({ otp: String(generateOtpCode()) }),
	signUp: EmailSignUp({ otp: String(generateOtpCode()) }),
};

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const templateName = searchParams.get("name") || undefined;

	const emailComponent = emails[templateName!];

	if (!emailComponent) {
		return new NextResponse("Email template not found", { headers: { "Content-Type": "text/html" } });
	}

	const html = await render(emailComponent, { pretty: true });

	return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}
