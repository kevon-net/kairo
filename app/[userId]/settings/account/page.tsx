import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";
import { Center, Divider, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import Partial from "@/partials";
import Component from "@/components";

export const metadata: Metadata = {
	title: "Account",
};

export default async function Account({ params }: { params: { userId: string } }) {
	const getDataAccount = async () => {
		try {
			const res = await fetch(`http://localhost:3000/api/${params.userId}/settings/account`, {
				next: { revalidate: 60 * 60 },
			});

			return res.json();
		} catch (error) {
			console.log("Fetch Error:", (error as Error).message);
		}
	};

	const data = await getDataAccount();
	return (
		<Layout.Page stacked>
			<Layout.Section>
				<Grid gutter={"xl"}>
					<GridCol span={{ base: 12, md: 7, lg: 5.5 }}>
						<Stack gap={"lg"}>
							<Title order={2} fz={"xl"}>
								Account Details
							</Title>
							<Partial.Form.User.Account.Details params={params} initial={data} />
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
							<Partial.Form.User.Account.Password params={params} />
						</Stack>
					</GridCol>
				</Grid>
			</Layout.Section>

			<Divider />

			<Layout.Section>
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
					<Component.Modal.Delete.Account params={params} />
				</Stack>
			</Layout.Section>
		</Layout.Page>
	);
}
