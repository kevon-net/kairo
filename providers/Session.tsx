"use client";

import { SessionProvider } from "next-auth/react";
import type { Session as SessionProps } from "next-auth";

export default function Session({ children, session }: { children: React.ReactNode; session: SessionProps | null }) {
	return (
		<SessionProvider
			session={session}
			refetchInterval={60 * 60 * 24 + 3.5} // half the max age set in auth
			refetchOnWindowFocus={false}
			refetchWhenOffline={false}
		>
			{children}
		</SessionProvider>
	);
}
