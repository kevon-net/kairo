import prisma from "@/databases/vercel";

import utility from "@/utilities";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
	try {
		const userId = params.userId;
		const userData = await prisma.user.findUnique({ where: { id: userId } });

		return Response.json(userData);
	} catch (error) {
		console.error("x-> Error getting account details:", (error as Error).message);
		return Response.error();
	}
}
