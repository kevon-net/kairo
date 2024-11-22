"use client";

import { SessionGet } from "@/types/models/session";
import { capitalizeWord } from "@/utilities/formatters/string";
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import React from "react";
import ModalDeleteSession from "../modals/delete/session";
import { useSession } from "@/hooks/auth";

export default function Session({ props }: { props: SessionGet }) {
	const { session } = useSession();

	return (
		<Card>
			<Stack>
				<Group justify="space-between">
					<Group gap={"xs"} align="start">
						<Title order={2} fz={"lg"}>
							{capitalizeWord(props.os!)}
						</Title>

						{session?.id == props.id && (
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
							{props.city}, {props.country}
						</Text>
					</Text>
					<Text inherit>
						GPS:{" "}
						<Text component="span" inherit fw={500} fz={"md"}>
							{props.loc}
						</Text>
					</Text>
				</Stack>
			</Stack>
		</Card>
	);
}
