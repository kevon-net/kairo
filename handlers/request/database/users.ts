import { apiUrl } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { FormUserCreate } from "@/types/form";
import { UserGet } from "@/types/models/user";
import { StatusUser } from "@prisma/client";

export const getUsers = async () => {
	try {
		const request = new Request(`${apiUrl}/users`, {
			method: EnumRequest.GET
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (get users):", error);
		throw error;
	}
};

export const updateUsers = async (users: UserGet[], mode: StatusUser) => {
	try {
		const request = new Request(`${apiUrl}/users`, {
			method: EnumRequest.PUT,
			body: JSON.stringify({ users, mode })
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update users):", error);
		throw error;
	}
};

export const updateUser = async (user: UserGet, mode: StatusUser) => {
	try {
		const request = new Request(`${apiUrl}/users/${user.id}`, {
			method: EnumRequest.PUT,
			body: JSON.stringify({ user, mode })
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update user):", error);
		throw error;
	}
};

export const addUser = async (user: FormUserCreate) => {
	try {
		const request = new Request(`${apiUrl}/users/new-user`, {
			method: EnumRequest.POST,
			body: JSON.stringify(user)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (add user):", error);
		throw error;
	}
};

export const removeUser = async (user: UserGet) => {
	try {
		const request = new Request(`${apiUrl}/${user.id}`, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(user)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (remove user):", error);
		throw error;
	}
};
