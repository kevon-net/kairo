import React from "react";

import { Anchor, Avatar, Flex, Grid, GridCol, Stack, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormUserProfileDetails from "@/partials/forms/user/profile/Details";

import initialize from "@/handlers/parsers/string/initialize";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function Profile() {
	const session = await auth();

	!session?.user && redirect("/");

	return (
		<LayoutPage stacked>
			<LayoutSection>
				<Stack gap={"xl"}>
					<Title order={2} fz={"xl"}>
						Profile Details
					</Title>
					<Grid>
						<GridCol span={{ base: 12, sm: 5, md: 12, lg: 12 }} order={{ base: 1, sm: 2, md: 1 }}>
							<Flex direction={{ base: "column", md: "row" }} align={"center"} gap={"xl"}>
								{session?.user.image ? (
									<Avatar
										src={session?.user.image}
										alt={session?.user.name ? session?.user.name : "User"}
										size={160}
									/>
								) : session?.user?.name ? (
									<Avatar alt={session?.user.name} size={160}>
										{initialize(session?.user.name)}
									</Avatar>
								) : (
									<Avatar size={160} />
								)}
								<Anchor>Edit Picture</Anchor>
							</Flex>
						</GridCol>
						<GridCol span={{ base: 12, sm: 7, md: 12, lg: 7 }} order={{ base: 2, sm: 1, md: 1 }}>
							<FormUserProfileDetails />
						</GridCol>
					</Grid>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
