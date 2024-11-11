import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/components/layout/page";
import FormAuthSignUp from "@/components/form/auth/sign-up";
import LayoutAuth from "@/components/layout/auth";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUp() {
	return (
		<LayoutPage>
			<LayoutAuth
				props={{
					title: "Create Your Account",
					desc: "Join us and start your journey today.",
				}}
			>
				<FormAuthSignUp />
			</LayoutAuth>
		</LayoutPage>
	);
}
