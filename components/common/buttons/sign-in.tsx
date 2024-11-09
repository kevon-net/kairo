"use client";

import React from "react";

import { Button, ButtonProps } from "@mantine/core";

import { signIn } from "@/handlers/event/auth";

export default function SignIn({ children, ...restProps }: { children: React.ReactNode } & ButtonProps) {
	return (
		<Button {...restProps} onClick={async () => await signIn()}>
			{children}
		</Button>
	);
}
