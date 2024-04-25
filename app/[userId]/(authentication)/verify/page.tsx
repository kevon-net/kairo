import React from "react";

import { Metadata } from "next";
import NextImage from "next/image";

import { Stack, Text, Title, Image } from "@mantine/core";

import asset from "@/assets";
import Layout from "@/layouts";
import Partial from "@/partials";

export const metadata: Metadata = {
	title: "Verify Account",
};

export default function Verify({ params }: { params: { userId: string } }) {
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
								Verify Account
							</Title>
							<Text className="textResponsive" ta={"center"}>
								A verification code has been sent to the provided email.
							</Text>
						</Stack>
					</Stack>

					<Partial.Form.Authentication.Verify userId={params.userId} />
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
