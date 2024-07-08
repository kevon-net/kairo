"use client";

import React from "react";

import { signOut } from "next-auth/react";

export default function signUserOut({ children }: { children: React.ReactNode }) {
	return <div onClick={() => signOut()}>{children}</div>;
}
