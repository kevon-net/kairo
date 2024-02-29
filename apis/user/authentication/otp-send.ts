const url = "http://localhost:3000/auth/verify/:userEmail";

import { typeVerify } from "@/types/form";

export default async function otpSend(data: typeVerify) {
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
		console.error("x-> Otp request failed:", error.message);
	}
}
