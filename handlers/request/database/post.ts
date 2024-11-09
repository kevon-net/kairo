import { apiUrl } from "@/data/constants";
import { authenticateHeaders } from "@/libraries/wrappers/request";
import { Request as EnumRequest } from "@/types/enums";
import { FormPostCreate } from "@/types/form";
import { PostGet } from "@/types/models/post";

const baseRequestUrl = `${apiUrl}/post`;
const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const postCreate = async (post: FormPostCreate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(post),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create post):", error);
		throw error;
	}
};

export const postDelete = async (post: PostGet) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.DELETE,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(post),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (delete post):", error);
		throw error;
	}
};
