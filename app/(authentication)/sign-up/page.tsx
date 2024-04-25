import React from "react";

import Link from "next/link";
import NextImage from "next/image";
import { Metadata } from "next";

import { Anchor, Stack, Text, Title, Image } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";
import asset from "@/assets";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default function Signup() {
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

					<Partial.Form.Authentication.Signup />

					<Text className="textResponsive" c={"dimmed"} ta={"center"}>
						Already have an account?{" "}
						<Anchor component={Link} inherit fw={"bold"} href={"/sign-in"} c={"pri.8"}>
							Sign In
						</Anchor>
						.
					</Text>
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
