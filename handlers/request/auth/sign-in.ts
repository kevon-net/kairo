import { apiUrl } from "@/data/constants";
import { Credentials } from "@/types/auth";
import { Request as EnumRequest } from "@/types/enums";

export const signIn = async (params: Credentials) => {
	try {
		const request = new Request(`${apiUrl}/auth/sign-in`, {
			method: EnumRequest.POST,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		const res = await response.json();

		return { response, ...res };
	} catch (error) {
		console.error("---> handler error - (sign in):", error);
	}
};
