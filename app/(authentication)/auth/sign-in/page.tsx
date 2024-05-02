import React from "react";

import Link from "next/link";
import NextImage from "next/image";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Anchor, Stack, Text, Title, Image } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";
import asset from "@/assets";

import { getProviders } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
	title: "Sign In",
};

export default async function SignIn() {
	const providers = await getProviders();
	const session = await auth();

	session && session.user && redirect("/");

	return (
		<Layout.Page padded>
			<Layout.Section containerized="xs">
				<Stack gap={"xl"}>
					<Stack align="center">
						<Image
							src={asset.icon.tool.nextjs}
							alt="next logo"
							w={{ base: 56, xs: 72, md: 96 }}
							component={NextImage}
							priority
						/>
						<Stack gap={"xs"}>
							<Title order={1} ta={"center"} fz={{ base: "lg", xs: 24, md: 32 }}>
								Sign In
							</Title>
							<Text className="textResponsive" ta={"center"}>
								Enter your credentials to access your account.
							</Text>
						</Stack>
					</Stack>

					<Partial.Form.Authentication.SignIn providers={providers} />

					<Text className="textResponsive" c={"dimmed"} ta={"center"}>
						Don't have an account yet?{" "}
						<Anchor component={Link} inherit fw={"bold"} href={"/auth/sign-up"} c={"pri.8"}>
							Sign Up
						</Anchor>
						.
					</Text>
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
