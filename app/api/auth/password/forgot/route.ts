// import dotenv from "dotenv";

import jwt from "jsonwebtoken";

import prisma from "@/databases/next";

import controller from "@/controllers";
import utility from "@/utilities";
import { typeUser } from "@/types/models";

// // env file
// dotenv.config({ path: "/.env" });

export async function POST(req: Request, res: Response) {
	try {
		const { email } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			res.json();
			return Response.json({
				user: false,
			});
		} else {
			const otlExists = await prisma.otl.findUnique({ where: { userId: userRecord.id } });

			if (!otlExists) {
				const link = await createOtl(userRecord);
				link.otlHash && (await createOtlRecord(userRecord.id, link.otlHash, await createExpiry()));
				link.otl && (await sendMail(link.otl, userRecord));

				return Response.json({
					user: { otl: false },
				});
			} else {
				const deserializedDate = BigInt(otlExists.expires);

				if (deserializedDate < Date.now()) {
					await prisma.otl.delete({ where: { userId: userRecord.id } });

					const link = await createOtl(userRecord);
					link.otlHash && (await createOtlRecord(userRecord.id, link.otlHash, await createExpiry()));
					link.otl && (await sendMail(link.otl, userRecord));

					return Response.json({
						user: { otl: { expired: true } },
					});
				} else {
					const otlRecord = await prisma.otl.findUnique({ where: { userId: userRecord.id } });

					return otlRecord
						? Response.json({
								user: {
									otl: {
										expired: false,
										expires: otlRecord.expires,
									},
								},
						  })
						: Response.error();
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

const createOtl = async (user: any) => {
	const secret = (process.env.SECRET_KEY as string) + user.password;
	const token = jwt.sign({ email: user.email, id: user.id }, secret, {
		expiresIn: "5m",
	});
	const otl = `http://localhost:3000/${user.id}/auth/password/reset/${token}`;
	const otlHash = await utility.hasher.create(otl);

	console.log("+> Otl:", otl);
	return { otl, otlHash };
};

const sendMail = async (otl: string, user: any) => {
	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to: user.email,
		subject: `Reset Your Password`,
		html: `<p>This link will expire in 1 hour. Click <a href="${otl}" target="_blank">here</a> to reset the password for <b>${user.email}</b>.</p>`,
	};

	return await controller.email.send(mailOptions);
};

const createExpiry = async () => BigInt(Date.now() + 1000 * 60 * 60).toString(); // create expiry & serialize for storage

const createOtlRecord = async (id: string, hash: string, expiry: string) =>
	await prisma.user.update({
		where: { id },
		data: {
			otls: {
				create: [
					{
						otl: hash,
						expires: expiry,
					},
				],
			},
		},
		include: { otls: true },
	});
