import prisma from "@/libraries/prisma";
import { ReplyCommentCreate, ReplyCommentUpdate } from "@/types/models/reply";
import { generateId } from "@/utilities/generators/id";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const reply: Omit<ReplyCommentCreate, "id" | "comment"> & { commentId: string; userId?: string } =
			await request.json();

		const replyRecord = await prisma.replyComment.findUnique({
			where: {
				content_commentId_name: {
					content: reply.content,
					commentId: reply.commentId,
					name: reply.name,
				},
			},
		});

		if (replyRecord) {
			return NextResponse.json({ error: "Reply already exists" }, { status: 409, statusText: "Already Exists" });
		}

		const createReply = await prisma.replyComment.create({
			data: { id: generateId(), name: reply.name, content: reply.content, commentId: reply.commentId },
		});

		return NextResponse.json(
			{ message: "Reply created successfully", reply: createReply },
			{ status: 200, statusText: "Reply Created" }
		);
	} catch (error) {
		console.error("---> route handler error (create reply):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: { params: { replyId: string } }) {
	try {
		const replyRecord = await prisma.replyComment.findUnique({ where: { id: params.replyId } });

		if (!replyRecord) {
			return NextResponse.json({ error: "Reply not found" }, { status: 404, statusText: "Not Found" });
		}

		const reply: ReplyCommentUpdate = await request.json();

		await prisma.replyComment.update({ where: { id: params.replyId }, data: reply });

		return NextResponse.json(
			{ message: "Your reply has been updated" },
			{ status: 200, statusText: "Reply Updated" }
		);
	} catch (error) {
		console.error("---> route handler error (update reply):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
