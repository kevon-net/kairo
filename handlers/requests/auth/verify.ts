import { apiUrl, headers } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";

export const verify = async (params: { otp: string; token: string }) => {
	try {
		const request = new Request(`${apiUrl}/auth/verify`, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: headers.withBody,
			body: JSON.stringify(params),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (verify):", error);
		throw error;
	}
};

export const verifyResend = async (token: string, userId: string) => {
	try {
		const request = new Request(`${apiUrl}/auth/verify/resend/${userId}`, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: headers.withBody,
			body: JSON.stringify(token),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (verify resend):", error);
		throw error;
	}
};
