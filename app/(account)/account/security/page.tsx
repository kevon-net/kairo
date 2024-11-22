import React from "react";

import { Anchor, Divider, Grid, GridCol, Group, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";
import FormUserAccountPassword from "@/components/form/user/account/password";
import ModalDeleteAccount from "@/components/common/modals/delete/account";
import ButtonClearSessions from "@/components/common/buttons/clear-sessions";
import CardSession from "@/components/common/cards/session";

import { Metadata } from "next";
import appData from "@/data/app";
import { sessionsGet } from "@/handlers/requests/database/session";
import { SessionRelations } from "@/types/models/session";

export const metadata: Metadata = { title: "Security" };

export default async function Security() {
	const { sessions }: { sessions: SessionRelations[] } = await sessionsGet();

	return (
		<LayoutPage stacked>
			<LayoutSection id="page-security-password" containerized={false}>
				<Stack gap={"lg"}>
					<Title order={2} fz={"xl"}>
						Password
					</Title>

					<FormUserAccountPassword />
				</Stack>
			</LayoutSection>

			<Divider />

			<LayoutSection id="page-security-delete" containerized={false}>
				<Stack gap={"lg"}>
					<Group justify="space-between">
						<Title order={2} fz={"xl"}>
							Devices
						</Title>

						<ButtonClearSessions>Sign Out of All Devices</ButtonClearSessions>
					</Group>

					<Text>A list of all devices signed in to your {appData.name.app} account.</Text>

					<Grid>
						{sessions?.map((session) => (
							<GridCol key={session.id} span={{ base: 12, xs: 6, lg: 4 }}>
								<CardSession props={session} />
							</GridCol>
						))}
					</Grid>
				</Stack>
			</LayoutSection>

			<Divider />

			<LayoutSection id="page-security-delete" containerized={false}>
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
