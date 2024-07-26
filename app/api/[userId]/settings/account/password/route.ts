import prisma from "@/services/prisma";
import hasher from "@/utilities/hasher";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
	try {
		const userId = params.userId;
		const { passwordCurrent, passwordNew } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: userId } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			const passwordMatch = await hasher.compare(passwordCurrent, userRecord.password);

			if (!passwordMatch) {
				return Response.json({ user: { exists: true, password: { match: false } } });
			} else {
				const passwordHash = await hasher.create(passwordNew);

				await prisma.user.update({
					where: { id: userId },
					data: { password: passwordHash },
				});

				return Response.json({ user: { exists: true, password: { match: true } } });
			}
		}
	} catch (error) {
		console.error("x-> Error changing password:", (error as Error).message);
		return Response.error();
	}
}
