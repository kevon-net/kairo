import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/components/layout/page";
import FormAuthPasswordForgot from "@/components/form/auth/password/forgot";
import LayoutAuth from "@/components/layout/auth";

export const metadata: Metadata = { title: "Forgot Password" };

export default async function Forgot() {
	return (
		<LayoutPage>
			<LayoutAuth
				props={{
					title: "Forgot Password?",
					desc: "No worries, we've got your back. Let's recover your account.",
				}}
			>
				<FormAuthPasswordForgot />
			</LayoutAuth>
		</LayoutPage>
	);
}
