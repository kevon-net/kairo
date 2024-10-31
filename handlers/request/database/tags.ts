import { apiUrl } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { TagCreate, TagGet } from "@/types/models/tag";

export const getTags = async () => {
	try {
		const request = new Request(`${apiUrl}/tags`, {
			method: EnumRequest.GET
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (get tags):", error);
		throw error;
	}
};

export const removeTags = async (tags: TagGet) => {
	try {
		const request = new Request(`${apiUrl}/tags`, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(tags)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (remove tags):", error);
		throw error;
	}
};

export const addTag = async (tag: TagCreate) => {
	try {
		const request = new Request(`${apiUrl}/tags/new-tag`, {
			method: EnumRequest.POST,
			body: JSON.stringify(tag)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (add tag):", error);
		throw error;
	}
};

export const removeTag = async (tag: TagGet) => {
	try {
		const request = new Request(`${apiUrl}/tags/${tag.id}`, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(tag)
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (remove tag):", error);
		throw error;
	}
};
