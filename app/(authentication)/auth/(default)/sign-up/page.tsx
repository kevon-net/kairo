import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import LayoutPage from "@/components/layout/page";
import FormAuthSignUp from "@/components/form/auth/signUp";
import LayoutAuth from "@/components/layout/auth";

import { auth } from "@/auth";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUp() {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<LayoutAuth
				props={{
					title: "Create Your Account",
					desc: "Join us and start your journey today."
				}}
			>
				<FormAuthSignUp />
			</LayoutAuth>
		</LayoutPage>
	);
}
