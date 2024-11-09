import { Request as EnumRequest } from "@/types/enums";
import { apiUrl } from "@/data/constants";
import { ProfileCreate, ProfileUpdate } from "@/types/models/profile";
import { authenticateHeaders } from "@/libraries/wrappers/request";

const baseRequestUrl = `${apiUrl}/profile`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const profileCreate = async (profile: Omit<ProfileCreate, "user"> & { userId: string }) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(profile),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create profile):", error);
		throw error;
	}
};

export const profileUpdate = async (profile: ProfileUpdate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.PUT,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(profile),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update profile):", error);
		throw error;
	}
};
