import { apiUrl } from "@/data/constants";
import { authenticateHeaders } from "@/libraries/wrappers/request";
import { Request as EnumRequest } from "@/types/enums";
import { UserCreate, UserGet, UserUpdate } from "@/types/models/user";

const baseRequestUrl = `${apiUrl}/user`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const userCreate = async (user: UserCreate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(user),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create user):", error);
		throw error;
	}
};

export const userUpdate = async (
	user: UserUpdate,
	options: { name?: boolean; password?: { update?: { new: string }; forgot?: "update" } }
) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.PUT,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify({ user, options }),
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
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(user),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (remove user):", error);
		throw error;
	}
};
