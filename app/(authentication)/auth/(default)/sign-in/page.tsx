import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Stack } from "@mantine/core";

import LayoutPage from "@/components/layouts/page";
import LayoutSection from "@/components/layouts/section";
import FormAuthSignIn from "@/components/partials/forms/auth/signIn";

import AuthHeader from "@/components/partials/auth/header";

import { auth } from "@/auth";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignIn() {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection id={"page-sign-in"} padded containerized={"xs"}>
				<Stack gap={40} px={{ md: 40 }}>
					<AuthHeader
						data={{
							title: "Welcome Back!",
							desc: "Sign in to access your personalized experience.",
						}}
					/>

					<FormAuthSignIn />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
