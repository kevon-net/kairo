"use client";

import { useContext } from "react";
import { SessionContext } from "@/contexts/session";
import { usePathname } from "next/navigation";

export const useSession = () => {
	const session = useContext(SessionContext);
	const pathname = usePathname();

	if (!session) {
		throw new Error("useSessionContext must be used within SessionProvider component");
	}

	return { session: session.session, updateSession: session.setSession, pathname };
};
