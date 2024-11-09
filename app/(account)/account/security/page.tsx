import React from "react";

import { Anchor, Divider, Grid, GridCol, Group, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";
import FormUserAccountPassword from "@/components/form/user/account/password";
import ModalDeleteAccount from "@/components/common/modals/delete/account";
import ButtonClearSessions from "@/components/common/buttons/clear-sessions";

import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/auth";
import appData from "@/data/app";
import { sessionsGet } from "@/handlers/request/database/session";
import CardSession from "@/components/common/cards/session";
import { SessionGet } from "@/types/models/session";

export const metadata: Metadata = { title: "Security" };

export default async function Security() {
	const session = await auth();

	!session && redirect(process.env.NEXT_PUBLIC_SIGN_IN_URL!);

	const sessions: { sessions?: SessionGet[] } = await sessionsGet();

	return (
		<LayoutPage stacked>
			<LayoutSection id="page-security-password">
				<Grid gutter={"xl"}>
					<GridCol span={{ base: 12 }}>
						<Stack gap={"lg"}>
							<Title order={2} fz={"xl"}>
								Password
							</Title>

							<FormUserAccountPassword />
						</Stack>
					</GridCol>
				</Grid>
			</LayoutSection>

			<Divider />

			<LayoutSection id="page-security-delete">
				<Stack gap={"lg"}>
					<Group justify="space-between">
						<Title order={2} fz={"xl"}>
							Devices
						</Title>

						<ButtonClearSessions>Sign Out of All Devices</ButtonClearSessions>
					</Group>

					<Text>A list of all devices signed in to your {appData.name.app} account.</Text>

					<Grid>
						{sessions.sessions?.map((session) => (
							<GridCol key={session.sessionToken} span={{ base: 12, sm: 6, xl: 4 }}>
								<CardSession props={session} />
							</GridCol>
						))}
					</Grid>
				</Stack>
			</LayoutSection>

			<Divider />

			<LayoutSection id="page-security-delete">
				<Stack gap={"lg"} align="start">
					<Title order={2} fz={"xl"}>
						Delete Account
					</Title>

					<Text>
						Our deletion process complies with the{" "}
						<Anchor inherit href="https://gdpr.eu/" target="_blank">
							GDPR regulations
						</Anchor>
						, which requires us to permanently delete user data upon request. As such, deleting your account
						will permanently remove all data associated with it and therefore be irreversible.
					</Text>

					<ModalDeleteAccount />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
