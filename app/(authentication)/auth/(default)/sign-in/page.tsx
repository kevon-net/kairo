import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/components/layout/page";
import FormAuthSignIn from "@/components/form/auth/sign-in";
import LayoutAuth from "@/components/layout/auth";
import { getSession } from "@/utilities/helpers/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignIn() {
	// const session = await getSession();
	// if (session) redirect("/");

	return (
		<LayoutPage>
			<LayoutAuth
				props={{
					title: "Welcome Back!",
					desc: "Sign in to access your personalized experience.",
				}}
			>
				<FormAuthSignIn />
			</LayoutAuth>
		</LayoutPage>
	);
}
