import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import { Anchor, Badge, Card, Divider, Grid, GridCol, Group, Image, Stack, Text, Title } from "@mantine/core";

import classes from "./new.module.scss";

import { linkify } from "@/utilities/formatters/string";
import { PostRelations } from "@/types/models/post";
import { getRegionalDate } from "@/utilities/formatters/date";
import { IconCategory } from "@tabler/icons-react";
import { iconSize, iconStrokeWidth } from "@/data/constants";

export default function New({ post }: { post: PostRelations }) {
	const path = `/blog/${linkify(post.title)}`;

	return (
		<Card className={classes.card} withBorder bg={"transparent"}>
			<Grid gutter={0}>
				<GridCol span={{ base: 12, sm: 6 }}>
					<Anchor component={Link} underline="hover" inherit href={path} title={post.title} pos={"relative"}>
						<Stack>
							<Image
								src={post.image}
								alt={post.title}
								component={NextImage}
								width={1920}
								height={1080}
								priority
							/>
						</Stack>

						<Group gap={"xs"} align="start" className={classes.overlay}>
							{post.tags.map((t) => (
								<Badge key={t.id} radius={"sm"} color="white" c={"black"} tt={"lowercase"}>
									{t.title}
								</Badge>
							))}
						</Group>
					</Anchor>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6 }}>
					<Stack
						gap={"lg"}
						px={{ base: "lg", sm: "xl" }}
						py={{ base: "lg", md: 32 }}
						justify="space-between"
						h={"100%"}
					>
						<Stack>
							<Title order={3} fz={28} lh={{ md: 1 }} className={classes.title}>
								<Anchor
									component={Link}
									underline="hover"
									inherit
									href={path}
									c={"inherit"}
									title={post.title}
								>
									{post.title}
								</Anchor>
							</Title>
							<Text className={classes.desc} lineClamp={6}>
								{post.content}
							</Text>
						</Stack>

						<Stack>
							<Divider />

							<Group justify="space-between">
								<Text fz={"xs"} inherit>
									{getRegionalDate(post.createdAt)}
								</Text>

								<Anchor
									component={Link}
									href={`/blog/categories/${post.category?.id}`}
									underline="never"
								>
									<Badge
										style={{ cursor: "inherit" }}
										variant="light"
										radius={"sm"}
										tt={"capitalize"}
										leftSection={<IconCategory size={iconSize} stroke={iconStrokeWidth} />}
									>
										{post.category?.title}
									</Badge>
								</Anchor>
							</Group>
						</Stack>
					</Stack>
				</GridCol>
			</Grid>
		</Card>
	);
}
