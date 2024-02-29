import { typeSignIn } from "@/types/form";

const url = "http://localhost:3000/auth/log-in";

export default async function signIn(data: typeSignIn) {
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
		console.error("x-> Signup request failed:", error.message);
	}
}
