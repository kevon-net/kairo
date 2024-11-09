import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { SessionCreate, SessionUpdate } from "@/types/models/session";
import { cookies } from "next/headers";
import { cookieName } from "@/data/constants";
import { StatusSession } from "@prisma/client";

export async function GET(request: NextRequest, { params }: { params: { sessionToken: string } }) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "You must be signed in" }, { status: 401, statusText: "Unauthorized" });
		}

		const sessionRecord = await prisma.session.findUnique({ where: { sessionToken: params.sessionToken } });

		if (!sessionRecord) {
			return NextResponse.json({ error: "Session not found" }, { status: 404, statusText: "Not Found" });
		}

		if (sessionRecord.status == StatusSession.INACTIVE) {
			// await prisma.session.delete({ where: { sessionToken: params.sessionToken } });

			return NextResponse.json(
				{ error: "Session is no longer active" },
				{ status: 401, statusText: "Session Deactivated" }
			);
		}

		return NextResponse.json(
			{ message: "Session retrieved successfully", session: sessionRecord },
			{ status: 200, statusText: "Session Retrieved" }
		);
	} catch (error) {
		console.error("---> route handler error (create session):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}

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

		const createNewSession = await prisma.session.create({ data: session });

		return NextResponse.json(
			{ message: "Session created successfully", session: createNewSession },
			{ status: 200, statusText: "Session Created" }
		);
	} catch (error) {
		console.error("---> route handler error (create session):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: { params: { sessionToken: string } }) {
	try {
		const sessionBody: SessionUpdate = await request.json();

		const sessionRecord = await prisma.session.findUnique({ where: { sessionToken: params.sessionToken } });

		if (!sessionRecord) {
			return NextResponse.json({ error: "Session not found" }, { status: 404, statusText: "Not Found" });
		}

		await prisma.session.update({ where: { sessionToken: params.sessionToken }, data: sessionBody });

		return NextResponse.json(
			{ message: "Your session has been updated" },
			{ status: 200, statusText: "Session Updated" }
		);
	} catch (error) {
		console.error("---> route handler error (update session):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { sessionToken: string } }) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "You must be signed in" }, { status: 401, statusText: "Unauthorized" });
		}

		const sessionRecord = await prisma.session.findUnique({ where: { sessionToken: params.sessionToken } });

		if (!sessionRecord) {
			return NextResponse.json({ error: "Session not found" }, { status: 404, statusText: "Not Found" });
		}

		await prisma.session.delete({ where: { sessionToken: params.sessionToken } });

		cookies().delete(cookieName.sessionJti);

		return NextResponse.json(
			{ message: "Your session has been deleted" },
			{ status: 200, statusText: "Session Deleted" }
		);
	} catch (error) {
		console.error("---> route handler error (delete session):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
