import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import model from "@/models";
import controller from "@/controllers";
import utility from "@/utilities";

// env file
dotenv.config({ path: "/.env.local" });

export async function POST(req: Request, res: Response) {
	try {
		const { email } = await req.json();

		const userRecord = await model.user.findOne({ where: { email } });
		const otlRecord = await model.otl.findOne({ where: { email } });

		if (!userRecord) {
			res.json();
			return Response.json({
				user: false,
			});
		} else {
			const secret = (process.env.JWT_SECRET_KEY as string) + userRecord.password;
			const token = jwt.sign({ email: userRecord.email, id: userRecord.id }, secret, {
				expiresIn: "5m",
			});

			const otl = `http://localhost:5173/auth/password/reset/${userRecord.id}/${token}`;
			const otlHash = await utility.hasher.create(otl);

			const mailOptions = {
				from: process.env.SENDER_USERNAME,
				to: userRecord.email,
				subject: `Reset Your Password`,
				html: `<p>This link will expire in 1 hour. Click <a href="${otl}" target="_blank">here</a> to reset the password for <b>${userRecord.email}</b>.</p>`,
			};

			if (!otlRecord) {
				await controller.email.send(mailOptions);

				await controller.database.otl.create({
					email: email,
					otl: otlHash,
					userId: userRecord.id,
					createdAt: Date.now(),
					expiredAt: Date.now() + 3600000,
				});

				return Response.json({
					user: { otl: false, link: otl },
				});
			} else {
				if (otlRecord.expiredAt < Date.now()) {
					await otlRecord.destroy();

					await controller.email.send(mailOptions);

					await controller.database.otl.create({
						email: email,
						otl: otlHash,
						userId: userRecord.id,
						createdAt: Date.now(),
						expiredAt: Date.now() + 3600000,
					});

					return Response.json({
						user: { otl: { expired: true }, link: otl },
					});
				} else {
					return Response.json({
						user: {
							otl: {
								expired: false,
								time: utility.converter.millToMinSec(otlRecord.expiredAt - Date.now()),
							},
							link: otl,
						},
					});
				}
			}
		}
	} catch (error) {
		console.error("x-> Error sending password reset link:", (error as Error).message);

		return Response.json({
			error: "Error sending password reset link",
			message: (error as Error).message,
		});
	}
}
