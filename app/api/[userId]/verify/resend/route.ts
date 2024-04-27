import dotenv from "dotenv";

import model from "@/prisma/models";
import controller from "@/controllers";
import utility from "@/utilities";

// env file
dotenv.config({ path: "/.env" });

export default async function POST(req: Request, res: Response, { params }: { params: { userId: string } }) {
	try {
		const { userId } = params;
		// const { userId } = await req.json();

		const user = await model.user.findOne({ where: { id: userId } });

		if (!user) {
			return Response.json({
				user: false,
			});
		} else {
			if (user.verified == true) {
				return Response.json({ user: { userVerified: true } });
			} else {
				const otpRecord = await model.otp.findOne({ where: { email: user.email } });

				const otp = Math.floor(1000 + Math.random() * 9000);
				const otpHash = await utility.hasher.create(`${otp}`);

				const mailOptions = {
					from: process.env.SENDER_USERNAME as string,
					to: user.email,
					subject: `Verify Your Email`,
					html: `<p>This is the OTP <b>${otp}</b> that you requested. It will expire in 1 hour.</p> Click <a href="http://localhost:5173/${userId}/verify" target="_blank">here</a> to verify`,
				};

				if (!otpRecord) {
					await controller.database.otp.create({
						email: user.email,
						otp: otpHash,
						createdAt: Date.now(),
						expiredAt: Date.now() + 3600000,
					});

					await controller.email.send(mailOptions);

					return Response.json({
						user: { otp: { expired: true } },
					});
				} else {
					if (otpRecord.expiredAt < Date.now()) {
						await otpRecord.destroy();

						await controller.database.otp.create({
							email: user.email,
							otp: otpHash,
							createdAt: Date.now(),
							expiredAt: Date.now() + 3600000,
						});

						await controller.email.send(mailOptions);

						return Response.json({
							user: { otp: { expired: true } },
						});
					} else {
						return Response.json({
							user: {
								otp: { timeToExpiry: utility.converter.millToMinSec(otpRecord.expiredAt - Date.now()) },
							},
						});
					}
				}
			}
		}
	} catch (error) {
		console.error("x-> Error re-verifying:", (error as Error).message);
		return Response.json({
			error: "Error re-verifying",
			message: (error as Error).message,
		});
	}
}
