"use client";

import React from "react";

import { Flex, Stack, Text, Title } from "@mantine/core";
import { useSession } from "@/hooks/auth";

import AvatarMain from "@/components/common/avatars/main";

export default function User() {
	const { session } = useSession();

	return (
		<Flex direction={{ base: "column", lg: "row" }} align={"center"} justify={"center"} gap={"md"} w={"100%"}>
			<AvatarMain />

			{session && (
				<Stack gap={0}>
					<Title order={3} fz={"md"} ta={{ base: "center", lg: "start" }}>
						{session.user.name}
					</Title>

					<Text fz={"xs"} c={"dimmed"} ta={{ base: "center", lg: "start" }}>
						{session.user.email}
					</Text>
				</Stack>
			)}
		</Flex>
	);
}
