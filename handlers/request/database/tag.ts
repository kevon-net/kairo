import { apiUrl } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { TagCreate, TagGet } from "@/types/models/tag";

const baseRequestUrl = `${apiUrl}/tag`;

export const tagCreate = async (tag: TagCreate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
			body: JSON.stringify(tag),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create tag):", error);
		throw error;
	}
};

export const tagDelete = async (tag: TagGet) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(tag),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (delete tag):", error);
		throw error;
	}
};
