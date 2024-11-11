import React from "react";

import Link from "next/link";

import { Anchor, Badge, Card, CardSection, Divider, Group, Skeleton, Stack, Text, Title } from "@mantine/core";

import classes from "./main.module.scss";

import { PostRelations } from "@/types/models/post";

import { linkify } from "@/utilities/formatters/string";
import { getRegionalDate } from "@/utilities/formatters/date";

export default function Main({ post }: { post: PostRelations }) {
	const path = `/blog/${linkify(post.title)}`;

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
								{post.title}
							</Anchor>
						</Title>
						<Text className={classes.desc}>{post.content}</Text>
					</Stack>

					<Divider />

					<Group justify="space-between">
						<Badge variant="light" radius={"sm"} tt={"capitalize"}>
							{post.category?.title}
						</Badge>

						<Text fz={"xs"} inherit>
							{getRegionalDate(post.createdAt)}
						</Text>
					</Group>
				</Stack>
			</Stack>
		</Card>
	);
}
