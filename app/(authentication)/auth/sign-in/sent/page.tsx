import React from "react";

import { Metadata } from "next";
import NextImage from "next/image";

import { Image, Stack, Text, Title } from "@mantine/core";

import Layout from "@/layouts";
import asset from "@/assets";

export const metadata: Metadata = {
	title: "Sign In Link",
};

export default function Sent() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized="xs">
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
							Sign In Link Sent
						</Title>
						<Text className="textResponsive" ta={"center"} c={"dimmed"}>
							An email containing the link to sign in has been sent to the provided address. Remember to
							check the spam/junk folder(s).
						</Text>
					</Stack>
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
