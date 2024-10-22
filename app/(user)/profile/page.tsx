import React from "react";

import { Anchor, Divider, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";
import FormUserProfile from "@/components/form/user/profile";
import FormUserAccountPassword from "@/components/form/user/account/password";
import ModalDeleteAccount from "@/components/common/modals/delete/account";

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

					<GridCol span={{ base: 12, md: 8, lg: 5.5 }}>
						<FormUserProfile />
					</GridCol>
				</Grid>
			</LayoutSection>

			<Divider />

			<LayoutSection id="page-profile-password">
				<Grid gutter={"xl"}>
					<GridCol span={{ base: 12, md: 8, lg: 5.5 }}>
						<Stack gap={"lg"}>
							<Title order={2} fz={"xl"}>
								Update Password
							</Title>
							<FormUserAccountPassword />
						</Stack>
					</GridCol>
				</Grid>
			</LayoutSection>

			<Divider />

			<LayoutSection id="page-profile-delete">
				<Stack gap={"lg"} align="start">
					<Title order={2} fz={"xl"}>
						Delete Account
					</Title>
					<Stack gap={"xs"}>
						<Text>
							Our deletion process complies with the{" "}
							<Anchor inherit href="https://gdpr.eu/" target="_blank">
								GDPR regulations
							</Anchor>
							, which requires us to permanently delete user data upon request. As such, deleting your
							account will permanently remove all data associated with it and therefore be irreversible.
						</Text>
					</Stack>

					<ModalDeleteAccount />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
