import prisma from "@/databases/next";

import controller from "@/controllers";
import utility from "@/utilities";

export async function POST(req: Request, res: Response) {
	try {
		let { name, email, password } = await req.json();

		const userExists = await prisma.user.findUnique({ where: { email } });

		if (!userExists) {
			const passwordHash = await utility.hasher.create(password);

			const otp = Math.floor(1000 + Math.random() * 9000);
			const otpHash = await utility.hasher.create(`${otp}`);

			const expiryDate = await createExpiry();

			passwordHash &&
				otpHash &&
				(await prisma.user.create({
					data: {
						name,
						email,
						password: passwordHash,
						otps: {
							create: [
								{
									otp: otpHash,
									expires: expiryDate,
								},
							],
						},
						profile: {
							create: {
								username: null,
							},
						},
					},
					include: { otps: true, profile: true },
				}));

			const userRecord = await prisma.user.findUnique({ where: { email } });

			const mailOptions = {
				from: process.env.EMAIL_FROM,
				to: email,
				subject: `Verify Your Email`,
				html: `<p>This is the OTP <b>${otp}</b> for your email. It will expire in 1 hour.</p> Click <a href="http://localhost:3000/${userRecord?.id}/auth/verify/" target="_blank">here</a> to verify`,
			};

			await controller.email.send(mailOptions);

			console.log("+> Otp:", otp);

			return Response.json({ exists: false, user: userRecord });
		} else {
			console.log("x-> Sign-up API Error: User exists.");
			return Response.json({ exists: true, user: userExists });
		}
	} catch (error) {
		console.error("x-> Sign-up API error:", (error as Error).message);
		return Response.error();
	}
}

const createExpiry = async () => BigInt(Date.now() + 1000 * 60 * 60).toString(); // create expiry & serialize for storage
