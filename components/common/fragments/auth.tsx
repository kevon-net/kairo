"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";
import { setRedirectUrl } from "@/utilities/helpers/url";
import { useSignOut } from "@/hooks/auth";
import { Box, LoadingOverlay } from "@mantine/core";

export function SignIn({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();

	return <span onClick={() => router.push(setRedirectUrl(pathname))}>{children}</span>;
}

export function SignOut({ children }: { children: React.ReactNode }) {
	const { signOut, loading } = useSignOut();

	return (
		<Box component="span" pos="relative" onClick={signOut}>
			<LoadingOverlay
				visible={loading}
				zIndex={1000}
				overlayProps={{ radius: "sm", blur: 2 }}
				loaderProps={{ size: "xs" }}
			/>
			{children}
		</Box>
	);
}
