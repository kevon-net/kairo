import prisma from "@/services/prisma";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
	try {
		const userId = params.userId;
		const { name, email } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: userId } });

		if (!userRecord) {
			return Response.json({
				user: false,
			});
		} else {
			await prisma.user.update({
				where: { id: userId },
				data: { name: name, email: email },
			});

			return Response.json({ user: true });
		}
	} catch (error) {
		console.error("x-> Error changing account details:", (error as Error).message);
		return Response.error();
	}
}
