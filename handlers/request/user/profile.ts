import { Request as EnumRequest } from "@/types/enums";
import { apiUrl } from "@/data/constants";
import { Profile as FormProfile } from "@/types/form";

export const updateProfile = async (params: FormProfile) => {
	try {
		const request = new Request(`${apiUrl}/user/profile`, {
			method: EnumRequest.PUT,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update profile):", error);
		throw error;
	}
};
