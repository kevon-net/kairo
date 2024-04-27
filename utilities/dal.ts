import "server-only";

import { cache } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import sessionActions from "./session";

export const verifySession = cache(async () => {
	const cookie = cookies().get("session")?.value;
	const session = await sessionActions.encryption.decrypt(cookie);

	if (!session?.userId) {
		redirect("/login");
	}

	return { isAuth: true, userId: session.userId };
});
