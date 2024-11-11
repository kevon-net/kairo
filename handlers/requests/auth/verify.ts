import { apiUrl, headers } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { Verify } from "@/types/form";

export const verify = async (params: Verify) => {
	try {
		const request = new Request(`${apiUrl}/auth/verify/${params.userId}`, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: headers.withBody,
			body: JSON.stringify(params.otp),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (verify):", error);
		throw error;
	}
};

export const verifyResend = async (params: { userId: string }) => {
	try {
		const request = new Request(`${apiUrl}/auth/verify/${params.userId}/resend`, {
			method: EnumRequest.GET,
			credentials: "include",
			headers: headers.withoutBody,
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (verify resend):", error);
		throw error;
	}
};
