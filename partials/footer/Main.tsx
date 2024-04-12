"use client";

import React from "react";

import Image from "next/image";

import {
	Flex,
	Grid,
	Stack,
	Image as MantineImage,
	Text,
	Title,
	List,
	Anchor,
	Divider,
	Group,
	ActionIcon,
} from "@mantine/core";

import Layout from "@/layouts";
import asset from "@/assets";
import Component from "@/components";

import classes from "./Main.module.scss";
import Link from "next/link";

const linkSets = [
	{
		title: "About",
		links: [
			{ label: "Features", link: "#" },
			{ label: "Pricing", link: "#" },
			{ label: "Support", link: "#" },
			{ label: "Forums", link: "#" },
		],
	},
	{
		title: "Project",
		links: [
			{ label: "Contribute", link: "#" },
			{ label: "Media assets", link: "#" },
			{ label: "Changelog", link: "#" },
			{ label: "Releases", link: "#" },
		],
	},
	{
		title: "Community",
		links: [
			{ label: "Join Discord", link: "#" },
			{ label: "Follow on Twitter", link: "#" },
			{ label: "Email newsletter", link: "#" },
			{ label: "GitHub discussions", link: "#" },
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
			<Component.Core.Container.Responsive>
				<Grid py={{ xs: "xl" }}>
					<Grid.Col span={{ base: 12, md: 4 }}>
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
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 8 }} visibleFrom="sm">
						<Grid mt={{ sm: "xl", md: 0 }}>
							{linkSets.map(linkSet => (
								<Grid.Col key={linkSet.title} span={"auto"}>
									<Flex direction={"column"} align={{ base: "center", md: "end" }} gap={"xs"}>
										<Title order={4}>{linkSet.title}</Title>
										<List listStyleType="none">
											{linkSet.links.map(link => (
												<List.Item key={link.link} className={classes.listItem}>
													<Anchor
														component={Link}
														href={link.link}
														title={link.label}
														className={classes.link}
													>
														{link.label}
													</Anchor>
												</List.Item>
											))}
										</List>
									</Flex>
								</Grid.Col>
							))}
						</Grid>
					</Grid.Col>
				</Grid>
			</Component.Core.Container.Responsive>
			<Divider my={"xl"} />
			<Component.Core.Container.Responsive>
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
							<a href={social.link}>
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
			</Component.Core.Container.Responsive>
		</Layout.Section>
	);
}
