import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import {
	Anchor,
	Badge,
	Box,
	Card,
	CardSection,
	Divider,
	Grid,
	GridCol,
	Group,
	Image,
	Skeleton,
	Stack,
	Text,
	Title,
} from "@mantine/core";

import classes from "./main.module.scss";

import { PostRelations } from "@/types/models/post";

import { linkify } from "@/handlers/parsers/string";
import { parseDateYmd } from "@/handlers/parsers/date";

export default function Main({ data }: { data: PostRelations }) {
	return (
		<Card className={classes.card} withBorder padding={"lg"}>
			<Stack gap={"lg"}>
				<CardSection>
					<Anchor component={Link} underline="hover" inherit href={`/blog/${linkify(data.title)}`}>
						<Skeleton height={240} radius={0} />
					</Anchor>
				</CardSection>

				<Stack gap={"lg"}>
					<Stack>
						<Title order={3} fz={{ base: "xl" }} className={classes.title}>
							<Anchor
								component={Link}
								underline="hover"
								inherit
								href={`/blog/${linkify(data.title)}`}
								c={"inherit"}
							>
								{data.title}
							</Anchor>
						</Title>
						<Text className={classes.desc}>{data.desc}</Text>
					</Stack>

					<Divider />

					<Group justify="space-between">
						<Badge variant="light" radius={"sm"} tt={"capitalize"}>
							{data.category}
						</Badge>

						<Text fz={"xs"} inherit>
							{data.date}
						</Text>
					</Group>
				</Stack>
			</Stack>
		</Card>
	);
}
