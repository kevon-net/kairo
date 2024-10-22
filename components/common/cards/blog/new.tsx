import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import { Anchor, Badge, Card, Divider, Grid, GridCol, Group, Skeleton, Stack, Text, Title } from "@mantine/core";

import classes from "./new.module.scss";

import { linkify } from "@/utilities/formatters/string";
import { PostRelations } from "@/types/models/post";
import { getRegionalDate } from "@/utilities/formatters/date";

export default function New({ props }: { props: PostRelations }) {
	return (
		<Card className={classes.card} withBorder>
			<Grid align="center" gutter={0}>
				<GridCol span={{ base: 12, sm: 6 }}>
					<Anchor component={Link} underline="hover" inherit href={`/blog/${linkify(props.title)}`}>
						<Skeleton h={{ base: 240, sm: 360 }} radius={0} />
					</Anchor>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6 }}>
					<Stack gap={"lg"} px={{ base: "lg", sm: "xl" }} py={{ base: "lg", md: 32 }}>
						<Stack>
							<Title order={3} fz={{ md: 28, lg: 36 }} lh={{ md: 1 }} className={classes.title}>
								<Anchor
									component={Link}
									underline="hover"
									inherit
									href={`/blog/${linkify(props.title)}`}
									c={"inherit"}
								>
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
				</GridCol>
			</Grid>
		</Card>
	);
}
