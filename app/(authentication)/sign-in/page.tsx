import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthSignIn from "@/partials/forms/auth/SignIn";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignIn() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized="xs">
				<FormAuthSignIn />
			</LayoutSection>
		</LayoutPage>
	);
}
