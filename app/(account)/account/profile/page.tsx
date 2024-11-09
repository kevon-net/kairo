import React from "react";

import { Anchor, Divider, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";
import FormUserProfile from "@/components/form/user/profile";

import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = { title: "Profile" };

export default async function Profile() {
	const session = await auth();

	!session && redirect(process.env.NEXT_PUBLIC_SIGN_IN_URL!);

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
