import { CategoryCreate, CategoryGet } from "@/types/models/category";
import { Request as EnumRequest } from "@/types/enums";
import { apiUrl } from "@/data/constants";

export const getCategories = async () => {
	try {
		const request = new Request(`${apiUrl}/categories`, {
			method: EnumRequest.GET
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (get categories):", error);
	}
};

export const addCategory = async (category: CategoryCreate) => {
	try {
		const request = new Request(`${apiUrl}/categories/new-category`, {
			method: EnumRequest.POST,
			body: JSON.stringify(category)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (add category):", error);
	}
};

export const removeCategory = async (category: CategoryGet) => {
	try {
		const request = new Request(`${apiUrl}/categories/${category.id}`, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(category)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (remove category):", error);
	}
};
