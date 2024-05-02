import jwt from "jsonwebtoken";

import prisma from "@/databases/next";

import controller from "@/controllers";
import utility from "@/utilities";

export async function POST(req: Request, res: Response) {
	try {
		const { userId, token, password } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: userId } });

		if (!userRecord) {
			return Response.json({
				user: false,
			});
		} else {
			const otlRecord = await prisma.otl.findUnique({ where: { userId } });

			if (!otlRecord) {
				return Response.json({
					user: { otl: false },
				});
			} else {
				try {
					const key = process.env.SECRET_KEY;
					const secret = key && key + userRecord.password;
					const verified = jwt.verify(token, secret);

					try {
						const match = await utility.hasher.compare(password, userRecord.password);

						if (!match) {
							const passwordHash = await utility.hasher.create(password);

							await prisma.user.update({
								where: { id: userId },
								data: { password: passwordHash },
							});

							await prisma.otl.delete({ where: { userId } });

							const mailOptions = {
								from: process.env.EMAIL_FROM,
								to: userRecord.email,
								subject: `Password Changed`,
								html: `The password for <b>${userRecord.email}</b> has been changed. If this action was not performed by you, contact support immediately at (<a href="mailto:support@example.com" >support@email.com</a>).`,
							};

							await controller.email.send(mailOptions);

							return Response.json({
								user: {
									otl: true,
									token: true,
									password: { same: false },
								},
							});
						} else {
							return Response.json({
								user: {
									otl: true,
									token: true,
									password: { same: true },
								},
							});
						}
					} catch (error) {
						console.error(`x-> Error updating password:`, (error as Error).message);
						return Response.error();
					}
				} catch (error) {
					console.error(`x-> Could not verify token:`, (error as Error).message);
					return Response.json({ user: { otl: true, token: false } });
				}
			}
		}
	} catch (error) {
		console.error("x-> Error changing password:", (error as Error).message);
		return Response.error();
	}
}
