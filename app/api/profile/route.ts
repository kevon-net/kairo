import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ProfileCreate, ProfileUpdate } from "@/types/models/profile";
import { getSession } from "@/utilities/helpers/session";

export async function POST(request: NextRequest) {
	try {
		const profile: Omit<ProfileCreate, "user"> & { userId: string } = await request.json();

		const userRecord = await prisma.user.findUnique({ where: { id: profile.userId }, include: { profile: true } });

		if (userRecord?.profile) {
			return NextResponse.json(
				{ error: "Profile already exists" },
				{ status: 409, statusText: "Already Exists" }
			);
		}

		const createProfile = await prisma.profile.create({ data: profile });

		return NextResponse.json(
			{ error: "Profile created successfully", profile: createProfile },
			{ status: 200, statusText: "Profile Created" }
		);
	} catch (error) {
		console.error("---> route handler error (create profile):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ error: "Sign in to continue" }, { status: 404, statusText: "Unauthorized" });
		}

		const profile: ProfileUpdate = await request.json();

		const userRecord = await prisma.user.findUnique({ where: { id: session.user.id }, include: { profile: true } });

		if (!userRecord?.profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404, statusText: "Not Found" });
		}

		await prisma.profile.update({ where: { userId: session.user.id }, data: profile });

		// // update session on server
		// session.user.name = profile.name;

		return NextResponse.json(
			{ message: "Your profile has been updated" },
			{ status: 200, statusText: "Profile Updated" }
		);
	} catch (error) {
		console.error("---> route handler error (update profile):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
