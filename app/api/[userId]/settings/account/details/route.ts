import { auth } from "@/auth";
import prisma from "@/services/prisma";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
	const session = await auth();

	try {
		const userId = params.userId;
		const { name, email } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: userId } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			await prisma.user.update({
				where: { id: userId },
				data: { name },
			});

			// // update session on server
			// if (session?.user) {
			// 	session.user.name = name;
			// 	session.user.email = email;
			// }

			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error changing account details:", (error as Error).message);
		return Response.error();
	}
}
