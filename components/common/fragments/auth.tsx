"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";
import { setRedirectUrl } from "@/utilities/helpers/url";
import { useSignOut } from "@/hooks/auth";

export function SignIn({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();

	return <span onClick={() => router.push(setRedirectUrl(pathname))}>{children}</span>;
}

export function SignOut({ children }: { children: React.ReactNode }) {
	const signOut = useSignOut();

	return <span onClick={signOut}>{children}</span>;
}
