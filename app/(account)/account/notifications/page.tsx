import React from "react";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";
import { Metadata } from "next";

import { Grid, GridCol, Stack, Title } from "@mantine/core";

import FormUserAccountNotifications from "@/components/form/user/account/notifications";

export const metadata: Metadata = { title: "Notifications" };

export default async function Notifications() {
	return (
		<LayoutPage stacked>
			<LayoutSection id="page-notifications">
				<Grid gutter={"xl"}>
					<GridCol span={{ base: 12 }}>
						<Stack gap={"xl"}>
							<Title order={2} fw={"bold"}>
								Notification Settings
							</Title>
							<FormUserAccountNotifications />
						</Stack>
					</GridCol>
				</Grid>
			</LayoutSection>
		</LayoutPage>
	);
}
