import { Request as EnumRequest } from "@/types/enums";
import { apiUrl, headers } from "@/data/constants";

const baseRequestUrl = `${apiUrl}/posts/categories`;

export const categoriesGet = async () => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.GET,
			credentials: "include",
			headers: headers.withoutBody,
		});

		const response = await fetch(request);

		const result = await response.json();

		return result;
	} catch (error) {
		console.error("---> handler error - (get categories):", error);
		throw error;
	}
};
