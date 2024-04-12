import dotenv from "dotenv";

import model from "@/models";
import controller from "@/controllers";
import utility from "@/utilities";

// env file
dotenv.config({ path: "/.env.local" });

// env file
require("dotenv").config({ path: "../.env" });

export default async function POST(req: Request, res: Response) {
	try {
		let { fname, lname, email, phone, password } = await req.json();

		const userRecord = await model.user.findOne({ where: { email } });

		if (!userRecord) {
			const passwordHash = await utility.hasher.create(password);

			await controller.database.user.create({
				fname: fname,
				lname: lname,
				email: email,
				phone: phone,
				password: passwordHash,
				verified: false,
			});

			const otp = Math.floor(1000 + Math.random() * 9000);
			const otpHash = await utility.hasher.create(`${otp}`);

			await controller.database.otp.create({
				email: email,
				otp: otpHash,
				createdAt: Date.now(),
				expiredAt: Date.now() + 3600000,
			});

			const mailOptions = {
				from: process.env.SENDER_USERNAME,
				to: email,
				subject: `Verify Your Email`,
				html: `<p>This is the OTP <b>${otp}</b> for your email. It will expire in 1 hour.</p> Click <a href="http://localhost:5173/auth/verify/${email}" target="_blank">here</a> to verify`,
			};

			await controller.email.send(mailOptions);

			console.log("+-> User signed up");
			return Response.json({
				user: false,
				userId: await model.user.findOne({ where: { email } }).id,
				message: `Verification email sent. OTP: ${otp}`,
			});
		} else {
			console.log("x-> User exists.");
			return Response.json({ user: true });
		}
	} catch (error) {
		console.error("x-> Error signing-up:", (error as Error).message);
		return Response.json({
			error: "Error signing-up",
			message: (error as Error).message,
		});
	}
}
