import prisma from "@/libraries/prisma";
import { compareHashes } from "@/utilities/helpers/hasher";
import { generateId } from "@/utilities/generators/id";
import { Provider } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Credentials } from "@/types/auth";
import { cookies } from "next/headers";
import { cookieName } from "@/data/constants";
import { getExpiry } from "@/utilities/helpers/time";
import { signIn } from "@/libraries/auth";

export async function POST(request: NextRequest) {
	try {
		const { provider, credentials }: { provider?: Provider; credentials?: Credentials } = await request.json();

		if (provider !== Provider.CREDENTIALS) {
			// handle oauth
			return NextResponse.json({ message: "Handle oauth" }, { status: 200, statusText: "Oauth" });
		}

		if (!credentials) {
			return NextResponse.json(
				{ error: "Credentials must be provided" },
				{ status: 406, statusText: "Missing Credentials" }
			);
		}

		const userRecord = await prisma.user.findUnique({
			where: { email: credentials.email },
			include: { profile: true },
		});

		if (!userRecord) {
			return NextResponse.json({ error: "User does not exist" }, { status: 404, statusText: "User Not Found" });
		}

		const passwordMatches = await compareHashes(credentials.password, userRecord.password);

		if (!passwordMatches) {
			return NextResponse.json(
				{ error: "User is not authorized" },
				{ status: 401, statusText: "Not Authorized" }
			);
		}

		await prisma.session.deleteMany({ where: { userId: userRecord.id, expiresAt: { lt: new Date(Date.now()) } } });

		const deviceGeoCookie = cookies().get(cookieName.device.geo)?.value;
		const deviceGeo = deviceGeoCookie ? await JSON.parse(decodeURIComponent(deviceGeoCookie)) : null;

		const expires = new Date(Date.now() + getExpiry(credentials.remember).millisec);

		const createSession = await prisma.session.create({
			data: {
				id: generateId(),
				expiresAt: expires,
				ip: deviceGeo.ip,
				city: deviceGeo.city,
				country: deviceGeo.country,
				loc: deviceGeo.loc,
				os: deviceGeo.os,
				userId: userRecord.id,
			},
		});

		await signIn(provider, createSession, userRecord, credentials);

		return NextResponse.json(
			{ message: "User authenticated successfully", user: userRecord },
			{ status: 200, statusText: "User Authenticated" }
		);
	} catch (error) {
		console.error("---> route handler error (sign up):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}
