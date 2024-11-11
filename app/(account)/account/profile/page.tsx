import React from "react";

import { Grid, GridCol, Title } from "@mantine/core";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";
import FormUserProfile from "@/components/form/user/profile";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function Profile() {
	return (
		<LayoutPage stacked>
			<LayoutSection id="page-profile-personal">
				<Grid>
					<GridCol span={{ base: 12 }}>
						<Title order={2} fz={"xl"}>
							Personal Details
						</Title>
					</GridCol>

					<GridCol span={{ base: 12, md: 8, lg: 6 }}>
						<FormUserProfile />
					</GridCol>
				</Grid>
			</LayoutSection>
		</LayoutPage>
	);
}
