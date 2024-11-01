import { auth } from "@/auth";
import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "You must be signed in" }, { status: 401, statusText: "Unauthorized" });
		}

		const userRecord = await prisma.user.findUnique({ where: { id: session.user.id } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404, statusText: "Not Found" });
		}

		const { name, email, phone } = await request.json();

		const fullName = `${name.first} ${name.last}`;

		// update user account and profile database
		await prisma.user.update({
			where: { id: session.user.id },
			data: { name: fullName, profile: { update: { firstName: name.first, lastName: name.last } } },
		});

		// update session on server
		session.user.name = fullName;

		return NextResponse.json(
			{ message: "Your profile has been updated" },
			{ status: 200, statusText: "Profile Updated" }
		);
	} catch (error) {
		console.error("---> route handler error (update profile):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
