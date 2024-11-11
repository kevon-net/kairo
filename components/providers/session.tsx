"use client";

import React, { useState } from "react";
import { Session as SessionClient } from "@/types/context";
import { Session as SessionServer } from "@/types/auth";
import { SessionContext } from "@/contexts/session";

export default function SessionProvider({
	sessionData = null,
	children,
}: {
	sessionData: SessionServer | null;
	children: React.ReactNode;
}) {
	const [session, setSession] = useState<SessionClient | null>(() => {
		if (!sessionData) return null;
		const { iat, exp, ...restSession } = sessionData;
		return restSession;
	});

	return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
}
