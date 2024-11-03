import { CategoryCreate, CategoryGet } from "@/types/models/category";
import { Request as EnumRequest } from "@/types/enums";
import { apiUrl } from "@/data/constants";

const baseRequestUrl = `${apiUrl}/category`;

export const categoryCreate = async (category: CategoryCreate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
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
			body: JSON.stringify(category),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (delete category):", error);
		throw error;
	}
};
