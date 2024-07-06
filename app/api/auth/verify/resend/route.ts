import otp from "@/handlers/generators/otp";
import code from "@/handlers/resend/email/auth/code";
import prisma from "@/services/prisma";
import converter from "@/utilities/converter";
import hasher from "@/utilities/hasher";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			if (!userRecord.verified) {
				// query database for otp
				const otpRecord = await prisma.otp.findUnique({ where: { email } });

				if (!otpRecord) {
					// create otp record
					const otpValue = otp();
					const otpHash = await hasher.create(otpValue.toString());
					otpHash && (await createOtp({ email, otp: otpHash }));

					// send otp email
					const emailResponse = await code.signUp({ otp: otpValue.toString(), email });

					return Response.json({
						user: { exists: true, verified: false },
						otp: { exists: false, value: otpValue },
					});
				} else {
					const now = new Date();
					const expired = otpRecord && otpRecord.expiresAt < now;

					if (!expired) {
						const expiry = otpRecord && otpRecord.expiresAt.getTime() - now.getTime();

						return Response.json({
							user: { exists: true, verified: false },
							otp: { exists: true, expired: false, time: converter.millSec(expiry) },
						});
					} else {
						// delete expired otp record
						await prisma.otp.delete({ where: { email } });

						// create new otp record
						const otpValue = otp();
						const otpHash = await hasher.create(otpValue.toString());
						otpHash && (await createOtp({ email, otp: otpHash }));

						// email new otp

						return Response.json({
							user: { exists: true, verified: false },
							otp: { exists: true, expired: true, value: otpValue },
						});
					}
				}
			} else {
				return Response.json({ user: { exists: true, verified: true } });
			}
		}
	} catch (error) {
		console.error("x-> Error signing up:", (error as Error).message);
		return Response.error();
	}
}

const createOtp = async (fields: { email: string; otp: string }) => {
	const expiry = new Date(Date.now() + 60 * 60 * 1000);

	try {
		await prisma.user.update({
			where: {
				email: fields.email,
			},
			data: {
				otps: {
					create: [{ email: fields.email, otp: fields.otp, expiresAt: expiry }],
				},
			},
		});
	} catch (error) {
		console.error("x-> Error creating new otp record:", (error as Error).message);
		throw error;
	}
};
