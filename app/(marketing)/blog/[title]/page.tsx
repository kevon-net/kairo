import React from "react";

import NextImage from "next/image";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";

import { typeParams } from "../layout";
import { PostRelations } from "@/types/models/post";
import { postsGet } from "@/handlers/requests/database/post";
import { linkify } from "@/utilities/formatters/string";
import { Group, Image, Stack, Text, Title } from "@mantine/core";
import { getRegionalDate } from "@/utilities/formatters/date";
import { IconCircleFilled } from "@tabler/icons-react";

export default async function Post({ params }: { params: typeParams }) {
	const { posts }: { posts: PostRelations[] } = await postsGet();

	const post: (PostRelations & { user: any }) | undefined = posts.find((p) => linkify(p.title) == params.title);

	return (
		<LayoutPage>
			<LayoutSection id={"page-post"} padded containerized={false}>
				<Stack gap={"xl"}>
					<Stack>
						<Group fz={"sm"} justify="center">
							<Text inherit>{!post?.user ? "Anonymous" : post.user.profile.name}</Text>
							<IconCircleFilled size={4} />
							<Text inherit>{getRegionalDate(post?.createdAt!)}</Text>
							<IconCircleFilled size={4} />
							<Text inherit>{post?.category?.title}</Text>
						</Group>

						<Title order={1} fz={40} ta={"center"}>
							{post?.title}
						</Title>
					</Stack>

					<Stack
						style={{ overflow: "hidden", borderRadius: "var(--mantine-radius-sm)" }}
						justify="center"
						h={480}
					>
						<Image
							src={post?.image}
							alt={post?.title!}
							component={NextImage}
							width={1920}
							height={1080}
							priority
						/>
					</Stack>

					<Text>{post?.content}</Text>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
