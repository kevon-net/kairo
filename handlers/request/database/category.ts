import { CategoryCreate, CategoryGet } from "@/types/models/category";
import { Request as EnumRequest } from "@/types/enums";
import { apiUrl } from "@/data/constants";
import { authenticateHeaders } from "@/libraries/wrappers/request";

const baseRequestUrl = `${apiUrl}/category`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const categoryCreate = async (category: CategoryCreate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(category),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create category):", error);
		throw error;
	}
};

export const categoryDelete = async (category: CategoryGet) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.DELETE,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(category),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (delete category):", error);
		throw error;
	}
};
