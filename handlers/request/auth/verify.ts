import { apiUrl } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { Verify } from "@/types/form";

export const verify = async (params: Verify) => {
	try {
		const request = new Request(`${apiUrl}/auth/verify`, {
			method: EnumRequest.POST,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (verify):", error);
	}
};

export const verifyResend = async (params: { email: string }) => {
	try {
		const request = new Request(`${apiUrl}/auth/verify/resend`, {
			method: EnumRequest.POST,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (verify resend):", error);
	}
};
