import { emailContactCreate } from "@/libraries/wrappers/email/contact";
import { NextRequest, NextResponse } from "next/server";
import { emailSendInquiry } from "@/libraries/wrappers/email/send/inquiry";

export async function POST(request: NextRequest) {
	try {
		const dataForm = await request.json();

		return NextResponse.json(
			{
				// send email
				email: await emailSendInquiry(dataForm),
				// add to audience
				contact: await emailContactCreate(dataForm)
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("---> route handler error (contact):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
