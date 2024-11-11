import prisma from "@/libraries/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ProfileCreate, ProfileUpdate } from "@/types/models/profile";
import { getSession } from "@/libraries/auth";
import { encrypt } from "@/utilities/helpers/token";
import { getExpiry } from "@/utilities/helpers/time";
import { cookieName } from "@/data/constants";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ error: "Sign in to continue" }, { status: 401, statusText: "Unauthorized" });
		}

		const profile: ProfileCreate = await request.json();

		const profileRecord = await prisma.profile.findUnique({ where: { userId: session.user.id } });

		if (profileRecord) {
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

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ error: "Sign in to continue" }, { status: 401, statusText: "Unauthorized" });
		}

		const profileRecord = await prisma.profile.findUnique({ where: { userId: params.userId } });

		if (!profileRecord) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404, statusText: "Not Found" });
		}

		const profile: ProfileUpdate = await request.json();

		await prisma.profile.update({ where: { userId: params.userId }, data: profile });

		const sessionToken = await encrypt(
			{ ...session, user: { ...session.user, name: profile.name } },
			getExpiry(session.user.remember).sec
		);

		cookies().set(cookieName.session, sessionToken, { expires: new Date(session.expires), httpOnly: true });

		return NextResponse.json(
			{ message: "Your profile has been updated" },
			{ status: 200, statusText: "Profile Updated" }
		);
	} catch (error) {
		console.error("---> route handler error (update profile):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
