import prisma from "@/databases/next";

import utility from "@/utilities";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
	try {
		const userId = params.userId;
		const { otp } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: userId } });
		const otpRecord = await prisma.otp.findUnique({ where: { userId } });

		if (!userRecord) {
			return Response.json({
				user: false,
			});
		} else {
			if (!userRecord.verified) {
				if (!otpRecord) {
					return Response.json({
						user: { verified: false, otp: false },
					});
				} else {
					const match = await utility.hasher.compare(otp, otpRecord?.otp);

					if (!match) {
						return Response.json({
							user: { verified: false, otp: { match: false } },
						});
					} else {
						const deserializedDate = BigInt(otpRecord.expires);

						if (deserializedDate < BigInt(Date.now())) {
							await prisma.otp.delete({ where: { userId } });

							return Response.json({
								user: { verified: false, otp: { match: true, expired: true } },
							});
						} else {
							await prisma.user.update({
								where: { id: userId },
								data: { verified: true },
							});

							await prisma.otp.delete({ where: { userId } });

							// add email to mailing list
							// await user?.update({ newsletter: true });

							return Response.json({
								user: { verified: false, otp: { match: true, expired: false } },
							});
						}
					}
				}
			} else {
				return Response.json({
					user: { verified: true },
				});
			}
		}
	} catch (error) {
		console.error("x-> Otp verification API error:", (error as Error).message);
		return Response.error();
	}
}
