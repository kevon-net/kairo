import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const categoryRecords = await prisma.category.findMany();

		return NextResponse.json({ categories: categoryRecords }, { status: 200, statusText: "Categories Retrieved" });
	} catch (error) {
		console.error("---> route handler error (get categories):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
