import { apiUrl } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";

export const passwordForgot = async (params: { email: string }) => {
	try {
		const request = new Request(`${apiUrl}/auth/password/forgot`, {
			method: EnumRequest.POST,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		const result = await response.json();

		return result;
	} catch (error) {
		console.error("---> handler error - (password forgot):", error);
	}
};

export const passwordReset = async (params: { password: string }, urlParams: { userId: string; token: string }) => {
	try {
		const request = new Request(`${apiUrl}/auth/password/reset/${urlParams.userId}/${urlParams.token}`, {
			method: EnumRequest.POST,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		const result = await response.json();

		return result;
	} catch (error) {
		console.error("---> handler error - (password reset):", error);
	}
};
