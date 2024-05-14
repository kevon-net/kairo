import prisma from "@/databases/vercel";

import utility from "@/utilities";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
	try {
		const userId = params.userId;
		const { passwordCurrent, passwordNew } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: userId } });

		if (!userRecord) {
			return Response.json({
				user: false,
			});
		} else {
			const passwordMatch = await utility.hasher.compare(passwordCurrent, userRecord.password);

			if (!passwordMatch) {
				return Response.json({
					user: { match: false },
				});
			} else {
				const passwordHash = await utility.hasher.create(passwordNew);

				await prisma.user.update({
					where: { id: userId },
					data: { password: passwordHash },
				});

				return Response.json({
					user: { match: true },
				});
			}
		}
	} catch (error) {
		console.error("x-> Error changing password:", (error as Error).message);
		return Response.error();
	}
}
