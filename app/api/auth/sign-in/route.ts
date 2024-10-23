import prisma from "@/libraries/prisma";
import { compareHashes } from "@/utilities/helpers/hasher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const credentials = await request.json();

		// check if user exists
		const userRecord = await prisma.user.findUnique({ where: { email: credentials.email as string } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// check if provided password is correct
		const passwordMatch = await compareHashes(credentials.password as string, userRecord.password);

		if (!passwordMatch) {
			return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		} else {
			return NextResponse.json({ message: "Logged in successfully" }, { status: 200 });
		}
	} catch (error) {
		console.error("---> route handler error (sign in):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
