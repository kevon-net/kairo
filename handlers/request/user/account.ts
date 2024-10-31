import { Request as EnumRequest } from "@/types/enums";
import { apiUrl } from "@/data/constants";
import { AccountDelete, AccountPassword } from "@/types/form";

const baseRequestUrl = `${apiUrl}/user/account`;

export const deleteAccount = async (params: AccountDelete) => {
	try {
		const request = new Request(`${baseRequestUrl}/delete`, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (delete account):", error);
		throw error;
	}
};

export const updateAccountPassword = async (params: AccountPassword) => {
	try {
		const request = new Request(`${baseRequestUrl}/password`, {
			method: EnumRequest.PUT,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update account password):", error);
		throw error;
	}
};

export const updateAccountNotifications = async (params: any) => {
	try {
		const request = new Request(`${baseRequestUrl}/notifications`, {
			method: EnumRequest.PUT,
			body: JSON.stringify(params)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update account notifications):", error);
		throw error;
	}
};
