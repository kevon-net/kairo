import { apiUrl, headers } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { UserCreate, UserUpdate } from "@/types/models/user";
import { authHeaders } from "@/utilities/helpers/auth";

const baseRequestUrl = `${apiUrl}/users`;

export const userCreate = async (user: UserCreate) => {
	try {
		const request = new Request(`${baseRequestUrl}/create`, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: await authHeaders(headers.withBody),
			body: JSON.stringify(user),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create user):", error);
		throw error;
	}
};

export const userUpdate = async (user: UserUpdate, options?: { password?: string; token?: string }) => {
	try {
		const request = new Request(`${baseRequestUrl}/${user.id}`, {
			method: EnumRequest.PUT,
			credentials: "include",
			headers: await authHeaders(headers.withBody),
			body: JSON.stringify({ user, options }),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update user):", error);
		throw error;
	}
};

export const userDelete = async (userId: string, password: string) => {
	try {
		const request = new Request(`${baseRequestUrl}/${userId}`, {
			method: EnumRequest.DELETE,
			credentials: "include",
			headers: await authHeaders(headers.withBody),
			body: JSON.stringify({ password }),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (remove user):", error);
		throw error;
	}
};
