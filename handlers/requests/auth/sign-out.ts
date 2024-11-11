import { apiUrl, headers } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";

export const signOut = async () => {
	try {
		const request = new Request(`${apiUrl}/auth/sign-in`, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: headers.withoutBody,
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (sign in):", error);
		throw error;
	}
};
