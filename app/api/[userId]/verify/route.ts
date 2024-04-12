import dotenv from "dotenv";

import model from "@/models";
import utility from "@/utilities";

// env file
dotenv.config({ path: "/.env.local" });

export default async function POST(req: Request, res: Response, { params }: { params: { userId: string } }) {
	try {
		const { userId } = params;
		const { otp } = await req.json();

		const user = await model.user.findOne({ where: { id: userId } });
		const otpRecord = await model.otp.findOne({ where: { email: user.email } });

		if (!otpRecord) {
			return Response.json({
				otp: false,
			});
		} else {
			const match = await utility.hasher.compare(otp, otpRecord.otp);

			if (!match) {
				return Response.json({
					otp: { match: false },
				});
			} else {
				if (otpRecord.expiredAt < Date.now()) {
					await otpRecord.destroy();

					return Response.json({
						otp: { match: true, expired: true },
					});
				} else {
					await user?.update({ verified: true });
					await user?.save();

					await otpRecord.destroy();

					// add email to mailing list
					// await user?.update({ newsletter: true });

					return Response.json({
						otp: { match: true, expired: false },
					});
				}
			}
		}
	} catch (error) {
		console.error("x-> Error verifying otp:", (error as Error).message);
		return Response.json({
			error: "Error verifying otp",
			message: (error as Error).message,
		});
	}
}
