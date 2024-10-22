import { apiUrl } from "@/data/constants";
import { Request as EnumRequest } from "@/types/enums";
import { FormPostCreate } from "@/types/form";
import { PostGet } from "@/types/models/post";

export const getPosts = async () => {
	try {
		const request = new Request(`${apiUrl}/posts`, {
			method: EnumRequest.GET
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (get posts):", error);
	}
};

export const removePosts = async (posts: PostGet[]) => {
	try {
		const request = new Request(`${apiUrl}/posts`, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(posts)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (remove posts):", error);
	}
};

export const addPost = async (post: FormPostCreate) => {
	try {
		const request = new Request(`${apiUrl}/posts/new-post`, {
			method: EnumRequest.POST,
			body: JSON.stringify(post)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (add post):", error);
	}
};

export const removePost = async (post: PostGet) => {
	try {
		const request = new Request(`${apiUrl}/posts/${post.id}`, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(post)
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (remove post):", error);
	}
};
