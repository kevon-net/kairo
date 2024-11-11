import { Request as EnumRequest } from "@/types/enums";
import { apiUrl, headers } from "@/data/constants";
import { AccountCreate, AccountUpdate } from "@/types/models/account";
import { AccountDelete } from "@/types/form";

const baseRequestUrl = `${apiUrl}/account`;

export const accountCreate = async (account: AccountCreate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: headers.withBody,
			body: JSON.stringify(account),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create account):", error);
		throw error;
	}
};

export const accountUpdate = async (account: AccountUpdate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.PUT,
			credentials: "include",
			headers: headers.withBody,
			body: JSON.stringify(account),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update account):", error);
		throw error;
	}
};

export const accountDelete = async (account: AccountDelete) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.DELETE,
			credentials: "include",
			headers: headers.withBody,
			body: JSON.stringify(account),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (delete account):", error);
		throw error;
	}
};
