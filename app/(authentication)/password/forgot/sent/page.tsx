import React from "react";

import { Metadata } from "next";
import Image from "next/image";

import { Image as MantineImage, Stack, Text, Title } from "@mantine/core";

import Layout from "@/layouts";
import asset from "@/assets";

export const metadata: Metadata = {
	title: "Reset Link Sent",
};

export default function Sent() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized="xs">
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
							Email Sent
						</Title>
						<Text className="textResponsive" ta={"center"} c={"dimmed"}>
							An email containing the link to reset your password has been sent to the provided email.
							Remember to check the spam/junk folder(s).
						</Text>
					</Stack>
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
