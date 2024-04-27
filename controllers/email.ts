import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { typeMail } from "@/types/options";

// env file
dotenv.config({ path: "/.env" });

const createTransporter = () => {
	try {
		return nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.SENDER_USERNAME as string,
				pass: process.env.SENDER_PASSWORD as string,
			},
		});
	} catch (error) {
		console.error("x-> Error creating transporter:", (error as Error).message);
	}
};

const email = {
	send: async (mailOptions: typeMail) => {
		try {
			const transporter = createTransporter();
			await transporter?.sendMail(mailOptions);
			console.log("+-> Email send success");
		} catch (error) {
			console.error("x-> Email send failed:", (error as Error).message);
		}
	},
};

export default email;
