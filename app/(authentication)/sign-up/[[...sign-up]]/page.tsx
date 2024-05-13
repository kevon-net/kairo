import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Center } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default async function SignUp() {
	return (
		<LayoutPage padded={40}>
			<LayoutSection containerized="xs">
				<Center>
					<ClerkSignUp />
				</Center>
			</LayoutSection>
		</LayoutPage>
	);
}
