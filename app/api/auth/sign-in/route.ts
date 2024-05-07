// import jwt from "jsonwebtoken";

import prisma from "@/databases/next";

import utility from "@/utilities";

export async function POST(req: Request, res: Response) {
	try {
		const { email, password } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			return Response.json(null);
		} else {
			const passwordMatch = await utility.hasher.compare(password, userRecord.password);

			if (!passwordMatch) {
				return Response.json(null);
			} else {
				// const token = jwt.sign({ email: userRecord.id }, process.env.SECRET_KEY as string, {
				// 	expiresIn: "7d",
				// });

				return Response.json({
					id: userRecord.id,
					role: userRecord.role,
					name: userRecord.name,
					email: userRecord.email,
					image: userRecord.image,
					// accessToken: token,
				});
			}
		}
	} catch (error) {
		console.error("x-> Error signing-in:", (error as Error).message);
		return Response.error();
	}
}
