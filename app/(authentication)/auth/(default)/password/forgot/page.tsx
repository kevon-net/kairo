import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/components/layout/page";
import FormAuthPasswordForgot from "@/components/form/auth/password/forgot";
import LayoutAuth from "@/components/layout/auth";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Forgot Password" };

export default async function Forgot() {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<LayoutAuth
				props={{
					title: "Forgot Password?",
					desc: "No worries, we've got your back. Let's recover your account."
				}}
			>
				<FormAuthPasswordForgot />
			</LayoutAuth>
		</LayoutPage>
	);
}
