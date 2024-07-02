import resend from "@/services/resend";

const code = {
	async signUp() {
		// switch to 'resend.general' when your domain is configured
		// const { data, error } = await resend.onboarding.emails.send({
		// 	// include & verify domain in dashboard before replacing it with "onboarding@resend.dev"
		// 	from: `${formData.fname} ${formData.lname} <onboarding@resend.dev>`,
		// 	to: ["kevon.kibochi@outlook.com"],
		// 	subject: formData.subject,
		// 	react: TemplateEmailContact(formData),
		// 	reply_to: formData.email,
		// 	// cc:[]
		// });
		// if (!error) {
		// 	return data;
		// } else {
		// 	console.error("x-> Error sending sign up code email:", (error as Error).message);
		// 	throw error;
		// }
	},
};

export default code;
