"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { Button, ButtonGroup } from "@mantine/core";

import { signIn } from "next-auth/react";

export default function Auth() {
	const router = useRouter();

	return (
		<ButtonGroup>
			<Button onClick={() => router.push("/auth/sign-up")} size="xs">
				Sign Up
			</Button>
			<Button onClick={async () => await signIn()} size="xs" variant="light">
				Log In
			</Button>
		</ButtonGroup>
	);
}
