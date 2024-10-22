import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Button, Flex, Group, Stack, Text, Title } from "@mantine/core";

import { IconArrowRight } from "@tabler/icons-react";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";

import { auth } from "@/auth";
import { signOut } from "@/handlers/event/sign-out";
import { iconStrokeWidth } from "@/data/constants";

export const metadata: Metadata = { title: "Sign Out" };

export default async function SignOut() {
	const session = await auth();

	!session && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection
				id={"page-sign-out-sign-out"}
				containerized="xs"
				padded
			>
				<Flex
					direction={"column"}
					align={{ base: "center", md: "start" }}
					gap={"xl"}
				>
					<Stack gap={"xs"}>
						<Title
							ta={{ base: "center", md: "start" }}
							order={1}
							fw={"bold"}
						>
							Sign Out
						</Title>

						<Stack gap={0}>
							<Text ta={{ base: "center", md: "start" }}>
								Are you sure you want to sign out?
							</Text>
						</Stack>
					</Stack>

					<Group>
						<Button onClick={signOut}>Sign Out</Button>
						<Button
							component={Link}
							href={"/"}
							variant="light"
							rightSection={
								<IconArrowRight
									size={16}
									stroke={iconStrokeWidth}
								/>
							}
						>
							Go Home
						</Button>
					</Group>
				</Flex>
			</LayoutSection>
		</LayoutPage>
	);
}
