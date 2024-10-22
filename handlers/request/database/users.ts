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

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (get users):", error);
	}
};

export const updateUsers = async (users: UserGet[], mode: StatusUser) => {
	try {
		const request = new Request(`${apiUrl}/users`, {
			method: EnumRequest.PUT,
			body: JSON.stringify({ users, mode })
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (update users):", error);
	}
};

export const updateUser = async (user: UserGet, mode: StatusUser) => {
	try {
		const request = new Request(`${apiUrl}/users/${user.id}`, {
			method: EnumRequest.PUT,
			body: JSON.stringify({ user, mode })
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (update user):", error);
	}
};

export const addUser = async (user: FormUserCreate) => {
	try {
		const request = new Request(`${apiUrl}/users/new-user`, {
			method: EnumRequest.POST,
			body: JSON.stringify(user)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (add user):", error);
	}
};

export const removeUser = async (user: UserGet) => {
	try {
		const request = new Request(`${apiUrl}/${user.id}`, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(user)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (remove user):", error);
	}
};
