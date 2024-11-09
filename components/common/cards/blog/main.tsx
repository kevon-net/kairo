import React from "react";

import Link from "next/link";

import { Anchor, Badge, Card, CardSection, Divider, Group, Skeleton, Stack, Text, Title } from "@mantine/core";

import classes from "./main.module.scss";

import { PostRelations } from "@/types/models/post";

import { linkify } from "@/utilities/formatters/string";
import { getRegionalDate } from "@/utilities/formatters/date";

export default function Main({ props }: { props: PostRelations }) {
	const slug = linkify(props.title);
	const path = `/blog/${slug}`;

	return (
		<Card className={classes.card} withBorder padding={"lg"}>
			<Stack gap={"lg"}>
				<CardSection>
					<Anchor component={Link} underline="hover" inherit href={path}>
						<Skeleton height={240} radius={0} />
					</Anchor>
				</CardSection>

				<Stack gap={"lg"}>
					<Stack>
						<Title order={3} fz={{ base: "xl" }} className={classes.title}>
							<Anchor component={Link} underline="hover" inherit href={path} c={"inherit"}>
								{props.title}
							</Anchor>
						</Title>
						<Text className={classes.desc}>{props.desc}</Text>
					</Stack>

					<Divider />

					<Group justify="space-between">
						<Badge variant="light" radius={"sm"} tt={"capitalize"}>
							{props.category}
						</Badge>

						<Text fz={"xs"} inherit>
							{getRegionalDate(props.date)}
						</Text>
					</Group>
				</Stack>
			</Stack>
		</Card>
	);
}
