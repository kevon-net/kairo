import prisma from "@/services/prisma";
import hasher from "@/utilities/hasher";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
	try {
		const userId = params.userId;
		const { password } = await req.json();

		const userRecord = await prisma.user.findUnique({ where: { id: userId } });

		if (!userRecord) {
			return Response.json({ user: { exists: false } });
		} else {
			const passwordMatch = await hasher.compare(password, userRecord.password);

			if (!passwordMatch) {
				if (!userRecord.password) {
					if (!password) {
						await handleDelete(userId);

						return Response.json({ user: { exists: true, password: { match: true } } });
					} else {
						return Response.json({ user: { exists: true, password: { match: false } } });
					}
				} else {
					return Response.json({ user: { exists: true, password: { match: false } } });
				}
			} else {
				await handleDelete(userId);

				return Response.json({ user: { match: true } });
			}
		}
	} catch (error) {
		console.error("x-> Error deleting account:", (error as Error).message);
		return Response.error();
	}
}

const handleDelete = async (id: string) => {
	// delete user-related records
	await prisma.account.deleteMany({ where: { userId: id } });
	// await prisma.comment.deleteMany({ where: { userId:id } });
	// await prisma.message.deleteMany({ where: { userId:id } });
	// await prisma.otl.deleteMany({ where: { userId:id } });
	// await prisma.otp.deleteMany({ where: { userId:id } });
	// await prisma.post.deleteMany({ where: { userId:id } });
	await prisma.profile.deleteMany({ where: { userId: id } });
	// await prisma.reply.deleteMany({ where: { userId:id } });
	// await prisma.session.deleteMany({ where: { userId:id } });
	// await prisma.verificationToken.deleteMany({ where: { userId:id } });

	// delete user
	await prisma.user.delete({ where: { id } });
};
