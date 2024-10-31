import { apiUrl } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { Contact } from "@/types/form";

export const sendInquiry = async (params: Contact) => {
	try {
		const request = new Request(`${apiUrl}/contact`, {
			method: EnumRequest.POST,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (send inquiry):", error);
		throw error;
	}
};
