import { typeForgot } from "@/types/form";

const url = "http://localhost:3000/auth/password-reset";

export default async function passwordForgot(data: typeForgot) {
	const postOptions = {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	};

	try {
		const response = await fetch(url, postOptions);
		const result = await response.json();

		return result;
	} catch (error: any) {
		console.error("x-> Email post request failed:", error.message);
	}
}
