import React from "react";

import { Metadata } from "next";
import NextImage from "next/image";

import { Stack, Text, Title, Image } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";
import asset from "@/assets";

export const metadata: Metadata = {
	title: "Reset Password",
};

export default function Reset({ params }: { params: { userId: string; token: string } }) {
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
								Reset Password
							</Title>
							<Text className="textResponsive" ta={"center"}>
								Enter the new credentials for your account.
							</Text>
						</Stack>
					</Stack>

					<Partial.Form.Authentication.Password.Reset params={params} />
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
