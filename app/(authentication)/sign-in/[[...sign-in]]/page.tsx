import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Center } from "@mantine/core";

import Layout from "@/layouts";

import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default async function SignUp() {
	return (
		<Layout.Page padded={40}>
			<Layout.Section containerized="xs">
				<Center>
					<ClerkSignIn />
				</Center>
			</Layout.Section>
		</Layout.Page>
	);
}
