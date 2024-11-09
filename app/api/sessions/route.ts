import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "You must be signed in" }, { status: 401, statusText: "Unauthorized" });
		}

		const sessionRecords = await prisma.session.findMany({ where: { userId: session.user.id } });

		if (!sessionRecords || sessionRecords.length < 1) {
			return NextResponse.json({ error: "Session not found" }, { status: 404, statusText: "Not Found" });
		}

		return NextResponse.json(
			{ message: "Session records retrieved successfully", sessions: sessionRecords },
			{ status: 200, statusText: "Sessions Retrieved" }
		);
	} catch (error) {
		console.error("---> route handler error (get sessions):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
