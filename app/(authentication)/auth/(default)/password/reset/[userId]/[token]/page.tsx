import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Stack } from "@mantine/core";

import LayoutPage from "@/components/layouts/page";
import LayoutSection from "@/components/layouts/section";
import FormAuthPasswordReset from "@/components/partials/forms/auth/password/reset";
import AuthHeader from "@/components/partials/auth/header";

import { typeParams } from "../../../../layout";
import { auth } from "@/auth";

export const metadata: Metadata = { title: "Reset Password" };

export default async function Reset({ params }: { params: typeParams }) {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection padded containerized={"xs"}>
				<Stack gap={40} px={{ md: 40 }}>
					<AuthHeader
						data={{
							title: "Enter Your New Password",
							desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ut laoreet velit ma.",
						}}
					/>

					<FormAuthPasswordReset data={params} />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
