import prisma from "@/databases/next";
import controller from "@/controllers";
import utility from "@/utilities";

import { typeUser } from "@/types/models";

export async function POST(req: Request, res: Response) {
	try {
		let { email, password } = await req.json();

		const userRecord: typeUser | null = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			const passwordHash = await utility.hasher.create(password);

			const otp = Math.floor(1000 + Math.random() * 9000);
			const otpHash = await utility.hasher.create(`${otp}`);

			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			passwordHash &&
				(await controller.database.user.create({
					data: {
						email,
						password: passwordHash,
						otps: {
							create: [
								{
									otp: otpHash,
									expiredAt: expiryDate,
								},
							],
						},
					},
					include: { otps: true },
				}));

			// const mailOptions = {
			// 	from: process.env.SENDER_USERNAME,
			// 	to: email,
			// 	subject: `Verify Your Email`,
			// 	html: `<p>This is the OTP <b>${otp}</b> for your email. It will expire in 1 hour.</p> Click <a href="http://localhost:5173/auth/verify/${email}" target="_blank">here</a> to verify`,
			// };

			// await controller.email.send(mailOptions);

			console.log("+-> User signed up");

			const userRecord: typeUser | null = await prisma.user.findUnique({ where: { email } });

			return Response.json({
				user: false,
				userId: userRecord ? userRecord.id : "User not found",
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
