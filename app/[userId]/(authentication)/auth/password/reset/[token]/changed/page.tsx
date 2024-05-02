import React from "react";

import { Metadata } from "next";
import NextImage from "next/image";

import { Image, Stack, Text, Title } from "@mantine/core";

import Layout from "@/layouts";
import asset from "@/assets";

export const metadata: Metadata = {
	title: "Password Changed",
};

export default function Changed() {
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
							Password Changed
						</Title>
						<Text className="textResponsive" ta={"center"} c={"dimmed"}>
							Your password has been updated.
						</Text>
					</Stack>
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
