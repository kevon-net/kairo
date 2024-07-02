import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthSignUp from "@/partials/forms/auth/SignUp";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUp() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized="xs">
				<FormAuthSignUp />
			</LayoutSection>
		</LayoutPage>
	);
}
