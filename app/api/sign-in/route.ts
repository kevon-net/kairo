import jwt from "jsonwebtoken";

import model from "@/prisma/models";
import utility from "@/utilities";

export default async function POST(req: Request, res: Response) {
	try {
		const { email, password } = await req.json();

		const userRecord = await model.user.findOne({ where: { email } });

		if (!userRecord) {
			return Response.json({ user: false });
		} else {
			const passwordMatch = await utility.hasher.compare(password, userRecord.password);

			if (!passwordMatch) {
				return Response.json({
					user: { passwordValid: false },
				});
			} else {
				// replace with session creator
				const token = jwt.sign({ email: userRecord.email }, process.env.JWT_SECRET_KEY as string, {
					expiresIn: "7d",
				});

				return Response.json({ user: { passwordValid: true, token, record: userRecord } });
			}
		}
	} catch (error) {
		console.error("x-> Error signing-in:", (error as Error).message);
		return Response.json({
			error: "Error signing-in",
			message: (error as Error).message,
		});
	}
}
