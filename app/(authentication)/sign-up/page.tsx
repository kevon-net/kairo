import React from "react";

import NextImage from "next/image";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthSignUp from "@/partials/forms/auth/SignUp";
import { Anchor, Center, Grid, GridCol, Group, Image, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import brand from "@/assets/images/brand";
import contact from "@/data/contact";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUp() {
	return (
		<LayoutPage>
			<Grid gutter={0}>
				<GridCol span={6} visibleFrom="md">
					<Center h={"100%"} bg={"var(--mantine-color-pri-light)"}>
						<LayoutSection margined containerized={"sm"} px={"xl"} pos={"relative"}>
							<Stack gap={64}>
								<Anchor component={Link} href={"/"}>
									<Group>
										<Image
											src={brand.logo.light}
											alt={contact.name.app}
											h={{ base: 48 }}
											component={NextImage}
											priority
										/>
									</Group>
								</Anchor>

								<Stack gap={"xs"}>
									<Title order={1} ta={{ base: "center", md: "start" }}>
										Welcome to Brix!
									</Title>
									<Text ta={{ base: "center", md: "start" }} w={{ md: "66%" }}>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ut laoreet
										velit ma.
									</Text>
								</Stack>
							</Stack>
						</LayoutSection>
					</Center>
				</GridCol>
				<GridCol span={{ base: 12, md: 6 }}>
					<Center mih={"100vh"}>
						<LayoutSection padded containerized={"xs"}>
							<Stack gap={40} px={{ md: 40 }}>
								<Stack gap={"xs"}>
									<Title order={2} ta={{ base: "center", md: "start" }}>
										Create Your Account
									</Title>
									<Text ta={{ base: "center", md: "start" }}>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ut laoreet
										velit ma.
									</Text>
								</Stack>

								<FormAuthSignUp />
							</Stack>
						</LayoutSection>
					</Center>
				</GridCol>
			</Grid>
		</LayoutPage>
	);
}
