import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Center } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUp() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized="xs">
				<Center>sign up form</Center>
			</LayoutSection>
		</LayoutPage>
	);
}
