import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { SessionCreate, SessionUpdate } from "@/types/models/session";
import { cookies } from "next/headers";
import { cookieName } from "@/data/constants";

export async function POST(request: NextRequest) {
	try {
		const session: Omit<SessionCreate, "user"> & { userId: string } = await request.json();

		const sessionRecord = await prisma.session.findUnique({ where: { sessionToken: session.sessionToken } });

		if (sessionRecord) {
			return NextResponse.json(
				{ error: "Session already exists" },
				{ status: 409, statusText: "Already Exists" }
			);
		}

		const handleSession = await prisma.$transaction(async (prisma) => {
			await prisma.session.deleteMany({ where: { userId: session.userId, expires: { lt: new Date() } } });
			const createNewSession = await prisma.session.create({ data: session });

			return createNewSession;
		});

		return NextResponse.json(
			{ error: "Session created successfully", session: handleSession },
			{ status: 200, statusText: "Session Created" }
		);
	} catch (error) {
		console.error("---> route handler error (create session):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const sessionDatabase: SessionUpdate = await request.json();

		const sessionRecord = await prisma.session.findUnique({
			where: { sessionToken: sessionDatabase.sessionToken as string },
		});

		if (!sessionRecord) {
			return NextResponse.json({ error: "Session not found" }, { status: 404, statusText: "Not Found" });
		}

		await prisma.session.update({
			where: { sessionToken: sessionDatabase.sessionToken as string },
			data: sessionDatabase,
		});

		return NextResponse.json(
			{ message: "Your session has been updated" },
			{ status: 200, statusText: "Session Updated" }
		);
	} catch (error) {
		console.error("---> route handler error (update session):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "You must be signed in" }, { status: 401, statusText: "Unauthorized" });
		}

		const token: string = await request.json();

		const sessionRecord = await prisma.session.findUnique({ where: { sessionToken: token } });

		if (!sessionRecord) {
			return NextResponse.json({ error: "Session not found" }, { status: 404, statusText: "Not Found" });
		}

		await prisma.session.delete({ where: { sessionToken: token } });

		cookies().delete(cookieName.tokenJti);

		return NextResponse.json(
			{ message: "Your session has been deleted" },
			{ status: 200, statusText: "Session Deleted" }
		);
	} catch (error) {
		console.error("---> route handler error (delete session):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
