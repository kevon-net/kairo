"use client";

import { SessionGet } from "@/types/models/session";
import { capitalizeWord } from "@/utilities/formatters/string";
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";
import ModalDeleteSession from "../modals/delete/session";

export default function Session({ props }: { props: SessionGet }) {
	const { data: session } = useSession();

	return (
		<Card>
			<Stack>
				<Group justify="space-between">
					<Group gap={"xs"} align="start">
						<Title order={2} fz={"lg"}>
							{capitalizeWord(props.os!)} Device
						</Title>

						{session?.sessionToken == props.sessionToken && (
							<Badge size="sm" variant="light" color="blue">
								current
							</Badge>
						)}
					</Group>

					<ModalDeleteSession props={props} />
				</Group>

				<Stack gap={0} fz={"sm"}>
					<Text inherit>
						IP:{" "}
						<Text component="span" inherit fw={500} fz={"md"}>
							{props.ip}
						</Text>{" "}
					</Text>
					<Text inherit>
						Location:{" "}
						<Text component="span" inherit fw={500} fz={"md"}>
							{props.city}, {props.country} ({props.loc})
						</Text>
					</Text>
				</Stack>
			</Stack>
		</Card>
	);
}
