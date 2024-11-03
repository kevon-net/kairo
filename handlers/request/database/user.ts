import { apiUrl } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { UserCreate, UserGet, UserUpdate } from "@/types/models/user";

const baseRequestUrl = `${apiUrl}/user`;

export const userCreate = async (user: UserCreate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
			body: JSON.stringify(user),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create user):", error);
		throw error;
	}
};

export const userUpdate = async (user: UserUpdate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.PUT,
			body: JSON.stringify(user),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update user):", error);
		throw error;
	}
};

export const userDelete = async (user: UserGet) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(user),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (remove user):", error);
		throw error;
	}
};
