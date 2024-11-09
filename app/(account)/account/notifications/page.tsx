import React from "react";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";
import { Metadata } from "next";

import { Grid, GridCol, Stack, Title } from "@mantine/core";

import FormUserAccountNotifications from "@/components/form/user/account/notifications";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Notifications" };

export default async function Notifications() {
	const session = await auth();

	!session && redirect(process.env.NEXT_PUBLIC_SIGN_IN_URL!);

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
