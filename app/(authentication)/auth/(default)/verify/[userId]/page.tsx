import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import LayoutPage from "@/components/layout/page";
import FormAuthVerify from "@/components/form/auth/verify";
import LayoutAuth from "@/components/layout/auth";

import { auth } from "@/auth";

import { Params } from "../../layout";

export const metadata: Metadata = { title: "Verify" };

export default async function Verify({ params }: { params: Params }) {
	const session = await auth();

	session && redirect("/");

	return (
		<LayoutPage>
			<LayoutAuth
				props={{
					title: "Verify Your Account",
					desc: `A one-time code has been sent to the provided email. Enter the code to verify.`
				}}
			>
				<FormAuthVerify props={{ userId: params.userId }} />
			</LayoutAuth>
		</LayoutPage>
	);
}
