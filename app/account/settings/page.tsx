import React from "react";

import { redirect } from "next/navigation";

import { Center, Divider, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormUserAccountDetails from "@/partials/forms/user/account/Details";
import FormUserAccountPassword from "@/partials/forms/user/account/Password";
import ModalDeleteAccount from "@/components/modal/delete/Account";

import { auth } from "@/auth";

export default async function Settings() {
	const session = await auth();

	!session?.user && redirect("/");

	// console.log(session?.user)

	return (
		<LayoutPage stacked>
			<LayoutSection>
				<Grid gutter={"xl"}>
					<GridCol span={{ base: 12, md: 7, lg: 5.5 }}>
						<Stack gap={"lg"}>
							<Title order={2} fz={"xl"}>
								Account Details
							</Title>
							{session && session.user && <FormUserAccountDetails data={session} />}
						</Stack>
					</GridCol>
					<GridCol span={{ base: 12, md: 7, lg: 1 }}>
						<Center h={"100%"}>
							<Divider orientation="vertical" />
						</Center>
					</GridCol>
					<GridCol span={{ base: 12, md: 7, lg: 5.5 }}>
						<Stack gap={"lg"}>
							<Title order={2} fz={"xl"}>
								Update Password
							</Title>
							{session && session.user && <FormUserAccountPassword data={session} />}
						</Stack>
					</GridCol>
				</Grid>
			</LayoutSection>

			<Divider />

			<LayoutSection>
				<Stack gap={"lg"} align="start">
					<Title order={2} fz={"xl"}>
						Delete Account
					</Title>
					<Stack gap={"xs"}>
						<Text>
							Deleting your account will permanently remove all data associated with it.{" "}
							<Text component="span" inherit c="red.6">
								Proceed with caution. This action is irreversible.
							</Text>
						</Text>
					</Stack>

					<ModalDeleteAccount />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
