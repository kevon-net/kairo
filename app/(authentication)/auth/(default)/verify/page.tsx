import React from "react";

import { Metadata } from "next";

import { Stack } from "@mantine/core";

import LayoutAuth from "@/components/layout/auth";
import LayoutPage from "@/components/layout/page";
import FormAuthVerify from "@/components/form/auth/verify";

export const metadata: Metadata = { title: "Verify" };

export default async function Verify() {
	return (
		<LayoutPage>
			<Stack gap={"lg"}>
				<LayoutAuth
					title="Verify Your Email"
					desc="Enter the code that has been sent to the email provided during registration."
				/>

				<FormAuthVerify />
			</Stack>
		</LayoutPage>
	);
}
