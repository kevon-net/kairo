import React from "react";

import LayoutSection from "@/components/layout/section";
import CardBlogAside from "@/components/common/cards/blog/aside";
import { PostRelations } from "@/types/models/post";
import { postsGet } from "@/handlers/requests/database/post";
import { Anchor, Badge, Divider, Grid, GridCol, Group, Stack, Title } from "@mantine/core";
import Link from "next/link";
import { CategoryGet } from "@/types/models/category";
import { categoriesGet } from "@/handlers/requests/database/category";
import { linkify } from "@/utilities/formatters/string";

export default async function Blog({ params }: { params: { title: string } }) {
	const { posts }: { posts: PostRelations[] } = await postsGet();
	const { categories }: { categories: CategoryGet[] } = await categoriesGet();

	return (
		<LayoutSection id={"partial-aside-blog"} padded containerized={false} pos={"sticky"} top={32}>
			<Stack gap={"xl"}>
				<Stack>
					<Title order={2}>Latest Posts</Title>

					<Grid>
						{posts.map(
							(post) =>
								linkify(post.title) != params.title &&
								posts.indexOf(post) < 3 && (
									<GridCol key={post.id} span={12}>
										<Stack>
											{posts.indexOf(post) != 0 && <Divider />}
											<CardBlogAside post={post} />
										</Stack>
									</GridCol>
								)
						)}
					</Grid>
				</Stack>

				<Stack>
					<Title order={2}>Categories</Title>

					<Group gap={"xs"}>
						{categories.map((c) => (
							<Anchor key={c.id} component={Link} href={`/blog/categories/${c.id}`} underline="never">
								<Badge style={{ cursor: "inherit" }} radius={"sm"} tt={"capitalize"}>
									{c.title}
								</Badge>
							</Anchor>
						))}
					</Group>
				</Stack>
			</Stack>
		</LayoutSection>
	);
}
