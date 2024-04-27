import React from "react";

import Image from "next/image";
import Link from "next/link";

import {
	Flex,
	Grid,
	Container,
	Image as MantineImage,
	Text,
	Title,
	List,
	Anchor,
	Divider,
	Group,
	GridCol,
	ListItem,
} from "@mantine/core";

import Layout from "@/layouts";
import asset from "@/assets";

import classes from "./Main.module.scss";

const linkSets = [
	{
		title: "About",
		links: [
			{ label: "Features", link: "#Features" },
			{ label: "Pricing", link: "#Pricing" },
			{ label: "Support", link: "#Support" },
			{ label: "Forums", link: "#Forums" },
		],
	},
	{
		title: "Project",
		links: [
			{ label: "Contribute", link: "#Contribute" },
			{ label: "Media assets", link: "#Media" },
			{ label: "Changelog", link: "#Changelog" },
			{ label: "Releases", link: "#Releases" },
		],
	},
	{
		title: "Community",
		links: [
			{ label: "Join Discord", link: "#Join" },
			{ label: "Follow on Twitter", link: "#Follow" },
			{ label: "Email newsletter", link: "#Email" },
			{ label: "GitHub discussions", link: "#GitHub" },
		],
	},
];

const socials = [
	{
		link: "#facebook",
		alt: "facebook",
		icon: asset.icon.social.facebook,
	},
	{
		link: "#twitter",
		alt: "twitter",
		icon: asset.icon.social.twitter,
	},
	{
		link: "#instagram",
		alt: "instagram",
		icon: asset.icon.social.instagram,
	},
];

export default function Main() {
	return (
		<Layout.Section padded={"xl"} className={classes.footer}>
			<Container size={"responsive"}>
				<Grid py={{ xs: "xl" }}>
					<GridCol span={{ base: 12, md: 4 }}>
						<Flex direction={"column"} align={{ base: "center", md: "start" }} gap={"md"}>
							<MantineImage
								src={asset.icon.tool.nextjs}
								alt="next logo"
								w={{ base: 48 }}
								component={Image}
								priority
							/>
							<Text className="textResponsive" ta={{ base: "center", md: "start" }}>
								Build fully functional accessible web applications faster than ever. Build fully
								functional accessible web applications faster than ever. Build fully functional
								accessible web applications faster than ever.
							</Text>
						</Flex>
					</GridCol>
					<GridCol span={{ base: 12, md: 8 }} visibleFrom="sm">
						<Grid mt={{ sm: "xl", md: 0 }}>
							{linkSets.map(linkSet => (
								<GridCol key={linkSet.title} span={"auto"}>
									<Flex direction={"column"} align={{ base: "center", md: "end" }} gap={"xs"}>
										<Title order={4}>{linkSet.title}</Title>
										<List listStyleType="none">
											{linkSet.links.map(link => (
												<ListItem key={link.link} className={classes.listItem}>
													<Anchor
														component={Link}
														href={link.link}
														title={link.label}
														className={classes.link}
													>
														{link.label}
													</Anchor>
												</ListItem>
											))}
										</List>
									</Flex>
								</GridCol>
							))}
						</Grid>
					</GridCol>
				</Grid>
			</Container>
			<Divider my={"xl"} />
			<Container size={"responsive"}>
				<Flex
					direction={{ base: "column", xs: "row" }}
					align={"center"}
					justify={{ xs: "space-between" }}
					gap={{ base: "xs", xs: "md" }}
				>
					<Text c={"dimmed"} fz={{ base: "xs", xs: "sm" }}>
						© 2024 next.template. All rights reserved.
					</Text>
					<Group>
						{socials.map(social => (
							<a key={social.link} href={social.link}>
								<MantineImage
									src={social.icon}
									alt={social.alt}
									title={social.alt}
									w={{ base: 24, md: 28 }}
									h={{ base: 24, md: 28 }}
									component={Image}
									priority
								/>
							</a>
						))}
					</Group>
				</Flex>
			</Container>
		</Layout.Section>
	);
}
