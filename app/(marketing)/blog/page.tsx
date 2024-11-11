import React from "react";

import { Box, Divider, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";
import CardBlogNew from "@/components/common/cards/blog/new";
import CardBlogMain from "@/components/common/cards/blog/main";

import sample from "@/data/sample";
import { postsGet } from "@/handlers/requests/database/post";
import { PostRelations } from "@/types/models/post";

export default async function Blog() {
	const posts: PostRelations[] = await postsGet();

	return (
		<LayoutPage>
			<LayoutSection id={"page-blog"} padded>
				<Stack gap={"xl"}>
					<Stack align="center">
						<Title order={2} ta={"center"}>
							Expert web design advice
						</Title>
						<Text ta={"center"} w={{ md: "50%", lg: "40%" }}>
							Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit
							aliquam sit nullam.
						</Text>
					</Stack>

					<Box w={{ md: "80%" }} mx={"auto"}>
						<CardBlogNew post={posts[0]} />
					</Box>
				</Stack>
			</LayoutSection>

			<LayoutSection id={"page-division"}>
				<Divider />
			</LayoutSection>

			<LayoutSection id={"page-posts"} padded>
				<Grid gutter={"xl"}>
					{posts.map(
						(post) =>
							posts.indexOf(post) != 0 && (
								<GridCol key={post.title} span={{ base: 12, sm: 6, md: 4 }}>
									<CardBlogMain post={post} />
								</GridCol>
							)
					)}
				</Grid>
			</LayoutSection>
		</LayoutPage>
	);
}
