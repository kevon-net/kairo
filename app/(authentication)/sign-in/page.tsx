import React from "react";

import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

import { Anchor, Stack, Text, Title, Image as MantineImage } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";
import asset from "@/assets";

export const metadata: Metadata = {
	title: "Sign In",
};

export default function SignIn() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized="xs">
				<Stack gap={"xl"}>
					<Stack align="center">
						<MantineImage
							src={asset.icon.tool.nextjs}
							alt="next logo"
							w={{ base: 56, xs: 72, md: 96 }}
							component={Image}
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

					<Partial.Form.Authentication.SignIn />

					<Text className="textResponsive" c={"dimmed"} ta={"center"}>
						Don't have an account yet?{" "}
						<Anchor component={Link} inherit fw={"bold"} href={"/sign-up"} c={"pri.8"}>
							Sign Up
						</Anchor>
						.
					</Text>
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
