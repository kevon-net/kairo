"use client";

import { useContext } from "react";
import { SessionContext } from "@/contexts/session";
import { usePathname } from "next/navigation";
import { signOut } from "@/handlers/events/auth";
import { showNotification } from "@/utilities/notifications";
import { NotificationVariant } from "@/types/enums";

export const useSession = () => {
	const session = useContext(SessionContext);
	const pathname = usePathname();

	if (!session) {
		throw new Error("useSessionContext must be used within SessionProvider component");
	}

	return { session: session.session, updateSession: session.setSession, pathname };
};

export const useSignOut = () => {
	const handleSignOut = async () => {
		try {
			const response = await signOut();
			const result = await response.json();

			if (!result) throw new Error("No response from server");

			if (!result.error) {
				// redirect to home page
				window.location.replace("/");
			}

			if (response.status == 401) {
				showNotification({ variant: NotificationVariant.WARNING }, response, result);
				return null;
			}

			throw new Error("An unexpected error occured");
		} catch (error) {
			showNotification({ variant: NotificationVariant.FAILED, desc: (error as Error).message });
			return null;
		}
	};

	return handleSignOut;
};
