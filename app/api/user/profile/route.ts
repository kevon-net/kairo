import { auth } from "@/auth";
import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRecord = await prisma.user.findUnique({ where: { id: session.user.id } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const { name, email, phone } = await request.json();

		// update user details
		await prisma.user.update({ where: { id: session.user.id }, data: { name } });

		// update session on server
		session.user.name = name;

		return NextResponse.json({ message: "Profile updated" }, { status: 200 });
	} catch (error) {
		console.error("---> route handler error (update profile):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
