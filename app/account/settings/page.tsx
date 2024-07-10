import React from "react";

import { Center, Divider, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormUserAccountDetails from "@/partials/forms/user/account/Details";
import FormUserAccountPassword from "@/partials/forms/auth/password/Reset";
import ModalDeleteAccount from "@/components/modal/delete/Account";

export default async function Settings({ params }: { params: { userId: string } }) {
	const getDataAccount = async () => {
		try {
			const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/${params.userId}/settings/account`, {
				next: { revalidate: 60 * 60 },
			});

			return res.json();
		} catch (error) {
			console.log("Fetch Error:", (error as Error).message);
		}
	};

	const data = await getDataAccount();
	return (
		<LayoutPage stacked>
			<LayoutSection>
				<Grid gutter={"xl"}>
					<GridCol span={{ base: 12, md: 7, lg: 5.5 }}>
						<Stack gap={"lg"}>
							<Title order={2} fz={"xl"}>
								Account Details
							</Title>
							<FormUserAccountDetails params={params} initial={data} />
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
							<FormUserAccountPassword params={params} />
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
					<ModalDeleteAccount params={params} />
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
