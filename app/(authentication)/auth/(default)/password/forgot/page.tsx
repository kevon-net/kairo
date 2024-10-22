import React from "react";

import { Metadata } from "next";

import { Stack } from "@mantine/core";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";
import FormAuthPasswordForgot from "@/components/form/auth/password/forgot";
import LayoutHeaderAuth from "@/components/layout/headers/auth";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Forgot Password" };

export default async function Forgot() {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection id={"page-forgot"} padded containerized={"xs"}>
				<Stack gap={40} px={{ md: 40 }}>
					<LayoutHeaderAuth
						data={{
							title: "Enter Your Email",
							desc: "No worries, we've got your back. Let's recover your account."
						}}
					/>

					<FormAuthPasswordForgot />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
