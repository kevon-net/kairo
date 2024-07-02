import prisma from "@/services/prisma";
import hasher from "@/utilities/hasher";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			const passwordHash = await hasher.create(password);
			// create user record
			passwordHash && (await createUser({ email, password: passwordHash }));

			return Response.json({ user: { exists: false } });
		} else {
			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error signing up:", (error as Error).message);
		return Response.error();
	}
}

const createUser = async (fields: { email: string; password: string }) => {
	try {
		await prisma.user.create({
			data: { email: fields.email, password: fields.password },
		});
	} catch (error) {
		console.error("x-> Error creating user record:", (error as Error).message);
		throw error;
	}
};
