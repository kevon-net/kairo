const url = "http://localhost:3000/auth/verify/resend/:userEmail";

export default async function otpResend(email: string) {
	const postOptions = {
		method: "POST",
		body: JSON.stringify({ email }),
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
		console.error("x-> Otp resend request failed:", error.message);
	}
}
