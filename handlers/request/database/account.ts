import { Request as EnumRequest } from "@/types/enums";
import { apiUrl } from "@/data/constants";
import { AccountCreate, AccountUpdate } from "@/types/models/account";
import { AccountDelete } from "@/types/form";
import { authenticateHeaders } from "@/libraries/wrappers/request";

const baseRequestUrl = `${apiUrl}/account`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const accountCreate = async (account: AccountCreate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: await authenticateHeaders(headers),
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
			headers: await authenticateHeaders(headers),
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
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(account),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (delete account):", error);
		throw error;
	}
};
