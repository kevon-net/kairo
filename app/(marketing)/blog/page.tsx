import React from "react";

import { Box, Divider, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/components/layouts/page";
import LayoutSection from "@/components/layouts/section";
import CardBlogNew from "@/components/card/blog/new";
import CardBlogMain from "@/components/card/blog/main";

import sample from "@/data/sample";

export default function Blog() {
	return (
		<LayoutPage>
			<LayoutSection id={"page-blog"} padded containerized={"responsive"}>
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
						<CardBlogNew data={sample.blogPosts[0]} />
					</Box>
				</Stack>
			</LayoutSection>

			<LayoutSection id={"page-division"} containerized={"responsive"}>
				<Divider />
			</LayoutSection>

			<LayoutSection id={"page-posts"} padded containerized={"responsive"}>
				<Grid gutter={"xl"}>
					{sample.blogPosts.map(
						post =>
							sample.blogPosts.indexOf(post) != 0 && (
								<GridCol key={post.title} span={{ base: 12, sm: 6, md: 4 }}>
									<CardBlogMain data={post} />
								</GridCol>
							)
					)}
				</Grid>
			</LayoutSection>
		</LayoutPage>
	);
}
