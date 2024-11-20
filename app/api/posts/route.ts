import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const postRecords = await prisma.post.findMany({
			include: { category: true, tags: true, user: { include: { profile: true } } },
		});

		return NextResponse.json({ posts: postRecords }, { status: 200, statusText: "Posts Retrieved" });
	} catch (error) {
		console.error("---> route handler error (get posts):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
