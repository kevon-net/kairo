import prisma from "@/databases/next";

import controller from "@/controllers";
import utility from "@/utilities";

export async function POST(req: Request, res: Response) {
	try {
		const { userId } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: userId } });

		if (!userRecord) {
			return Response.json({
				user: false,
			});
		} else {
			if (!userRecord.verified) {
				const otpRecord = await prisma.otp.findUnique({ where: { userId } });

				if (!otpRecord) {
					const pass = await createOtp();
					pass.otpHash && (await createOtpRecord(userId, pass.otpHash, await createExpiry()));
					pass.otp && (await sendMail(pass.otp, userRecord, userId));

					return Response.json({
						user: { verified: false, otp: false },
					});
				} else {
					const deserializedDate = BigInt(otpRecord.expires);

					if (deserializedDate < BigInt(Date.now())) {
						await prisma.otp.delete({ where: { userId } });

						const pass = await createOtp();
						pass.otpHash && (await createOtpRecord(userId, pass.otpHash, await createExpiry()));
						pass.otp && (await sendMail(pass.otp, userRecord, userId));

						return Response.json({
							user: { verified: false, otp: { expired: true } },
						});
					} else {
						return Response.json({
							user: {
								verified: false,
								otp: { expired: false, expires: otpRecord.expires },
							},
						});
					}
				}
			} else {
				return Response.json({ user: { verified: true } });
			}
		}
	} catch (error) {
		console.error("x-> Otp resend API error:", (error as Error).message);
		return Response.error();
	}
}

const createOtp = async () => {
	const otp = Math.floor(1000 + Math.random() * 9000);
	const otpHash = await utility.hasher.create(`${otp}`);

	console.log("+> Otp:", otp);
	return { otp, otpHash };
};

const sendMail = async (otp: number, user: any, userId: string) => {
	const mailOptions = {
		from: process.env.EMAIL_FROM as string,
		to: user.email,
		subject: `Verify Your Email`,
		html: `<p>This is the OTP <b>${otp}</b> that you requested. It will expire in 1 hour.</p> Click <a href="http://localhost:3000/${userId}/auth/verify" target="_blank">here</a> to verify`,
	};

	return await controller.email.send(mailOptions);
};

const createExpiry = async () => BigInt(Date.now() + 1000 * 60 * 60).toString(); // create expiry & serialize for storage

const createOtpRecord = async (id: string, hash: string, expiry: string) =>
	await prisma.user.update({
		where: { id },
		data: {
			otps: {
				create: {
					otp: hash,
					expires: expiry,
				},
			},
		},
		include: { otps: true },
	});
