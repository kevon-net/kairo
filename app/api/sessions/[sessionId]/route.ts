import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SessionCreate, SessionUpdate } from "@/types/models/session";
import { cookies } from "next/headers";
import { cookieName } from "@/data/constants";
import { Status } from "@prisma/client";
import { Session } from "@/types/auth";
import { getSession } from "@/libraries/auth";

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
	try {
		const sessionRecord = await prisma.session.findUnique({ where: { id: params.sessionId } });

		if (!sessionRecord) {
			return NextResponse.json({ error: "Session not found" }, { status: 404, statusText: "Not Found" });
		}

		if (sessionRecord.status == Status.INACTIVE) {
			await prisma.session.delete({ where: { id: params.sessionId } });

			return NextResponse.json(
				{ error: "The session was deactivated" },
				{ status: 401, statusText: "Session Inactive" }
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
		const session: SessionCreate = await request.json();

		const sessionRecord = await prisma.session.findUnique({ where: { id: session.id } });

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

export async function PUT(request: NextRequest, { params }: { params: { sessionId: string } }) {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ error: "Sign in to continue" }, { status: 401, statusText: "Unauthorized" });
		}

		const body: { session: SessionUpdate; options?: { create?: boolean } } = await request.json();

		const result = await prisma.$transaction(async () => {
			const deleteExpiredSessions = await prisma.session.deleteMany({
				where: { userId: session.user.id, expiresAt: { lt: new Date(Date.now()) } },
			});

			const sessionRecord = await prisma.session.findUnique({ where: { id: params.sessionId } });

			return { deleteExpiredSessions, sessionRecord };
		});

		if (!result.sessionRecord) {
			if (body.options?.create == true) {
				await prisma.session.create({
					data: {
						id: body.session.id as string,
						expiresAt: body.session.expiresAt as Date,
						ip: body.session.ip as string,
						city: body.session.city as string,
						country: body.session.country as string,
						loc: body.session.loc as string,
						os: body.session.os as string,
						userId: session.user.id,
					},
				});

				return NextResponse.json(
					{ error: "New session created" },
					{ status: 200, statusText: "Session Created" }
				);
			}

			return NextResponse.json({ error: "Session not found" }, { status: 404, statusText: "Not Found" });
		}

		await prisma.session.update({ where: { id: params.sessionId }, data: body.session });

		return NextResponse.json(
			{ message: "Your session has been updated" },
			{ status: 200, statusText: "Session Updated" }
		);
	} catch (error) {
		console.error("---> route handler error (update session):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { sessionId: string } }) {
	try {
		const sessionRecord = await prisma.session.findUnique({ where: { id: params.sessionId } });

		if (!sessionRecord) {
			return NextResponse.json({ error: "Session not found" }, { status: 404, statusText: "Not Found" });
		}

		await prisma.session.delete({ where: { id: params.sessionId } });

		cookies().delete(cookieName.session);

		return NextResponse.json(
			{ message: "Your session has been deleted" },
			{ status: 200, statusText: "Session Deleted" }
		);
	} catch (error) {
		console.error("---> route handler error (delete session):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
