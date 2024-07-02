import inquiry from "@/handlers/resend/email/inquiry";
import contact from "@/handlers/resend/contact";

export async function POST(req: Request) {
	try {
		const dataForm = await req.json();

		// send email
		const emailResponse = await inquiry.general(dataForm);
		// add to audience
		const contactResponse = await contact.create(dataForm);

		return Response.json({ email: emailResponse, contact: contactResponse });
	} catch (error) {
		console.error("x-> Error sending contact message:", (error as Error).message);
		return Response.error();
	}
}
