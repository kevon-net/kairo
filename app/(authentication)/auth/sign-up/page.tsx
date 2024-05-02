import React from "react";

import Link from "next/link";
import NextImage from "next/image";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Stack, Text, Title, Image } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";
import asset from "@/assets";

import { getProviders } from "next-auth/react";
import Provider from "@/providers";

import { auth } from "@/auth";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default async function Signup() {
	const providers = await getProviders();
	const session = await auth();

	session && session.user && redirect("/");

	return (
		<Layout.Page padded={40}>
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
								Sign Up
							</Title>
							<Text className="textResponsive" ta={"center"}>
								Enter your details to create an account.
							</Text>
						</Stack>
					</Stack>

					<Partial.Form.Authentication.Signup providers={providers} />

					<Text className="textResponsive" c={"dimmed"} ta={"center"}>
						Already have an account?{" "}
						<Provider.Signin>
							<Text component="span" inherit fw={"bold"} c={"pri.8"}>
								Sign In
							</Text>
						</Provider.Signin>
						.
					</Text>
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
