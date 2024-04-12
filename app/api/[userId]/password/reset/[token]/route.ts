import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import model from "@/models";
import controller from "@/controllers";
import utility from "@/utilities";

// env file
dotenv.config({ path: "/.env.local" });

interface typeParams {
	id: string;
	token: string;
}

export async function POST(req: Request, res: Response, { params }: { params: typeParams }) {
	try {
		const { id, token } = params;
		const { password } = await req.json();

		const userRecord = await model.user.findOne({ where: { id } });
		const otlRecord = await model.otl.findOne({ where: { userId: id } });

		if (!userRecord) {
			return Response.json({
				user: false,
			});
		} else {
			const secret = process.env.JWT_SECRET_KEY + userRecord.password;

			try {
				const verified = jwt.verify(token, secret);

				try {
					const match = await utility.hasher.compare(password, userRecord.password);

					if (!match) {
						const passwordHash = await utility.hasher.create(password);

						await userRecord.update({ password: passwordHash });
						await userRecord.save();
						await otlRecord?.destroy();

						const mailOptions = {
							from: process.env.SENDER_USERNAME,
							to: userRecord.email,
							subject: `Password Changed`,
							html: `The password for <b>${userRecord.email}</b> has been changed. If this was not you, contact support immediately (<a href="mailto:email@example.com" >support@email.com</a>).`,
						};

						await controller.email.send(mailOptions);

						return Response.json({
							user: { password: { match: false } },
						});
					} else {
						return Response.json({ user: { password: { match: true } } });
					}
				} catch (error) {
					console.error(`x-> Error updating password:`, (error as Error).message);
					return Response.json({
						error: "Error updating password",
						message: (error as Error).message,
					});
				}
			} catch (error) {
				console.error(`x-> Could not verify token:`, (error as Error).message);
				return Response.json({ user: { token: false } });
			}
		}
	} catch (error) {
		console.error("x-> Error changing password:", (error as Error).message);
		return Response.json({
			error: "Error changing password",
			message: (error as Error).message,
		});
	}
}
