import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import LayoutPage from "@/components/layouts/page";
import FormAuthSignUp from "@/components/partials/forms/auth/signUp";

import { auth } from "@/auth";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default async function SignUp() {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<FormAuthSignUp />
		</LayoutPage>
	);
}
