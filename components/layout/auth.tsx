import React from "react";

import NextImage from "next/image";
import Link from "next/link";

import { Anchor, Box, Grid, GridCol, Group, Image, Stack, Text, Title } from "@mantine/core";

import LayoutSection from "@/components/layout/section";

import images from "@/data/images";
import appData from "@/data/app";
import { sectionSpacing } from "@/data/constants";

export default function Auth({
	props,
	children
}: {
	props: { title: string; desc: string };
	children: React.ReactNode;
}) {
	const header = (
		<Stack gap={"xs"}>
			<Title order={1} ta={{ base: "center", md: "start" }} fz={{ base: "h2", md: "h1" }}>
				{props.title}
			</Title>
			<Text ta={{ base: "center", md: "start" }}>{props.desc}</Text>
		</Stack>
	);

	return (
		<LayoutSection id={"layout-auth"} containerized={false}>
			<Grid gutter={0} px={{ base: "md", xs: 0 }}>
				<GridCol span={5.5} visibleFrom="md" bg={"var(--mantine-color-pri-light)"}>
					<LayoutSection id={"layout-auth-heading"} containerized="xs" pos={"sticky"} top={0}>
						<Stack gap={"xl"} justify="center" h={"100vh"} px={{ xs: 32 }}>
							<Anchor component={Link} href={"/"}>
								<Group>
									<Image
										src={images.brand.logo.light}
										alt={appData.name.app}
										h={{ base: 48 }}
										component={NextImage}
										width={1920}
										height={1080}
										priority
									/>
								</Group>
							</Anchor>

							{header}
						</Stack>
					</LayoutSection>
				</GridCol>

				<GridCol span={{ base: 12, md: 6.5 }}>
					<LayoutSection id={"layout-auth-form"} containerized="xs">
						<Stack gap={"xl"} justify="center" mih={"100vh"} px={{ xs: 32 }} py={sectionSpacing}>
							<Box hiddenFrom="md">{header}</Box>

							{children}
						</Stack>
					</LayoutSection>
				</GridCol>
			</Grid>
		</LayoutSection>
	);
}
