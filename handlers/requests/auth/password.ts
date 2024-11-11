import { apiUrl, headers } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";

export const passwordForgot = async (params: { email: string }) => {
	try {
		const request = new Request(`${apiUrl}/auth/password/forgot`, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: headers.withBody,
			body: JSON.stringify(params),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (password forgot):", error);
		throw error;
	}
};

export const passwordReset = async (params: { password: string }, urlParams: { userId: string; token: string }) => {
	try {
		const request = new Request(`${apiUrl}/auth/password/reset/${urlParams.userId}/${urlParams.token}`, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: headers.withBody,
			body: JSON.stringify(params),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (password reset):", error);
		throw error;
	}
};
