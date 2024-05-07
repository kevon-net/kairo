"use client";

import React from "react";

import { signIn } from "next-auth/react";

export default function Signin({ children }: { children: React.ReactNode }) {
	return (
		<span onClick={() => signIn()} style={{ cursor: "pointer" }}>
			{children}
		</span>
	);
}
