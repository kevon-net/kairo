import React from "react";

import { Anchor, Avatar, Flex, Grid, GridCol, Stack, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormUserProfileDetails from "@/partials/forms/user/profile/Details";

import { currentUser } from "@clerk/nextjs/server";

import initialize from "@/handlers/parsers/string/initialize";

export default async function Profile() {
	const user = await currentUser();

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
								{user?.imageUrl ? (
									<Avatar
										src={user.imageUrl}
										alt={user.fullName ? user.fullName : "User"}
										size={160}
									/>
								) : user?.fullName ? (
									<Avatar alt={user.fullName} size={160}>
										{initialize(user.fullName)}
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
