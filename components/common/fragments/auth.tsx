"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";
import { setRedirectUrl } from "@/utilities/helpers/url";

export function SignIn({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();

	return <span onClick={() => router.push(setRedirectUrl(pathname))}>{children}</span>;
}

export function SignOut({ children }: { children: React.ReactNode }) {
	return <div onClick={() => {}}>{children}</div>;
}
