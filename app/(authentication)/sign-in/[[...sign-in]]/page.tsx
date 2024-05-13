import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Center } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

import ClerkSignIn from "@/components/clerk/SignIn";

export const metadata: Metadata = {
	title: "Sign In",
};

export default async function SignIn() {
	return (
		<LayoutPage padded={40}>
			<LayoutSection containerized="xs">
				<Center>
					<ClerkSignIn />
				</Center>
			</LayoutSection>
		</LayoutPage>
	);
}
