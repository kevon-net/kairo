import React from "react";

import NextImage from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Anchor, Center, Grid, GridCol, Group, Image, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthPasswordReset from "@/partials/forms/auth/password/Reset";
import AuthHeader from "@/partials/auth/Header";

import images from "@/assets/images";
import contact from "@/data/contact";

import { typeParams } from "../../../../layout";

export const metadata: Metadata = { title: "Reset Password" };

export default async function Reset({ params }: { params: typeParams }) {
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
