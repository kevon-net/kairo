import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Center } from "@mantine/core";

import Layout from "@/layouts";

import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
	title: "Sign In",
};

export default async function SignIn() {
	return (
		<Layout.Page padded={40}>
			<Layout.Section containerized="xs">
				<Center>
					<ClerkSignUp />
				</Center>
			</Layout.Section>
		</Layout.Page>
	);
}
