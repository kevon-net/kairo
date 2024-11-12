import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/components/layout/page";
import FormAuthPasswordReset from "@/components/form/auth/password/reset";
import LayoutAuth from "@/components/layout/auth";

import { Params } from "../../../../layout";

export const metadata: Metadata = { title: "Reset Password" };

export default async function Reset({ params }: { params: Params }) {
	return (
		<LayoutPage>
			<LayoutAuth
				props={{
					title: "Enter Your New Password",
					desc: "Reset your password and keep your account secure.",
				}}
			>
				<FormAuthPasswordReset data={params} />
			</LayoutAuth>
		</LayoutPage>
	);
}
