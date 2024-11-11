import { apiUrl } from "@/data/constants";
import { EmailInquiry } from "@/types/email";
import { Request as EnumRequest } from "@/types/enums";
import { contactCreate } from "./contact";

const baseRequestUrl = `${apiUrl}/email`;

export const emailCreate = async (options: Omit<EmailInquiry, "to"> & { phone: string; message: string }) => {
	try {
		const request = new Request(baseRequestUrl, { method: EnumRequest.POST, body: JSON.stringify(options) });

		const response = await fetch(request);

		const addContact = await contactCreate(options.from); // add contact to audience

		return response;
	} catch (error) {
		console.error("---> handler error - (create email):", error);
		throw error;
	}
};
