import React from "react";

import { Metadata } from "next";

import { Stack } from "@mantine/core";

import LayoutAuth from "@/components/layout/auth";
import LayoutPage from "@/components/layout/page";
import FormAuthPasswordReset from "@/components/form/auth/password/reset";

export const metadata: Metadata = { title: "Reset Password" };

export default async function Reset() {
	return (
		<LayoutPage>
			<Stack>
				<LayoutAuth title="Password Reset" desc="Enter your new password and keep your account secure." />

				<FormAuthPasswordReset />
			</Stack>
		</LayoutPage>
	);
}
