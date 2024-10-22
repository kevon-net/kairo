import { Request as EnumRequest } from "@/types/enums";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/upload`;

export const uploadFile = async (file: File) => {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const request = new Request(apiUrl, {
			method: EnumRequest.POST,
			body: formData
		});

		const response = await fetch(request);

		const res = await response.json();

		return res;
	} catch (error) {
		console.error("---> handler error - (upload file):", error);
		throw error;
	}
};
