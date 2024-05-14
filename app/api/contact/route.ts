import { send as emailSend, contacts as emailContacts } from "@/handlers/email";

export async function POST(req: Request) {
	try {
		const dataForm = await req.json();

		// send email
		const email = await emailSend(dataForm);
		// add to audience
		const contact = await emailContacts.create(dataForm);

		return Response.json({ email, contact });
	} catch (error) {
		console.error("x-> Error sending contact message:", (error as Error).message);
		return Response.error();
	}
}
