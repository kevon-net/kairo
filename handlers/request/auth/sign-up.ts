import { apiUrl } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { SignUp as FormAuthSignUp } from "@/types/form";

export const signUp = async (params: Omit<FormAuthSignUp, "passwordConfirm">) => {
	try {
		const request = new Request(`${apiUrl}/auth/sign-up`, {
			method: EnumRequest.POST,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (sign up):", error);
	}
};
