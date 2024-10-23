import { auth } from "@/auth";
import prisma from "@/libraries/prisma";
import { compareHashes } from "@/utilities/helpers/hasher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const { password } = await request.json();

		const userRecord = await prisma.user.findUnique({ where: { id: session.user.id } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		if (!userRecord.password) {
			if (!password) {
				await handleDelete(session.user.id!);

				return NextResponse.json({ user: { exists: true, password: { match: true } } });
			} else {
				return NextResponse.json({ user: { exists: true, password: { match: false } } });
			}
		} else {
			const passwordMatch = await compareHashes(password, userRecord.password);

			if (!passwordMatch) {
				return NextResponse.json({ user: { exists: true, password: { match: false } } });
			} else {
				await handleDelete(session.user.id!);

				return NextResponse.json({ user: { exists: true, password: { match: true } } });
			}
		}
	} catch (error) {
		console.error("x-> Error deleting account:", (error as Error).message);
		return NextResponse.error();
	}
}

const handleDelete = async (id: string) => {
	// delete user and user-related records
	await prisma.user.delete({
		where: { id },
		include: {
			profile: true,
			accounts: true,
			sessions: true,
			Authenticator: true,
			otps: true,
			otls: true,
			posts: true
		}
	});
};
