import React from "react";

import NextImage from "next/image";
import Link from "next/link";

import {
	Flex,
	Grid,
	Container,
	Image,
	Text,
	Title,
	List,
	Anchor,
	Divider,
	Group,
	GridCol,
	ListItem,
	Stack,
	ThemeIcon,
} from "@mantine/core";

import LayoutSection from "@/components/layout/section";

import images from "@/data/images";

import classes from "./main.module.scss";
import appData from "@/data/app";
import { dataSocials } from "@/app/(marketing)/contact/page";
import { iconStrokeWidth } from "@/data/constants";
import ActionIconTheme from "@/components/common/buttons/theme";

export default function Main() {
	return (
		<LayoutSection id={"partial-footer-main"} containerized={false} pt={56} pb={"lg"} className={classes.footer}>
			<Container size={"responsive"}>
				<Grid gutter={{ base: "xl", md: "md" }}>
					<GridCol span={{ base: 12, md: 4, lg: 3.5 }}>
						<Flex direction={"column"} align={{ base: "center", md: "start" }} gap={"md"}>
							<Image
								src={images.brand.logo.light}
								alt="next logo"
								w={{ base: 80 }}
								component={NextImage}
								width={1920}
								height={1080}
								loading="lazy"
							/>

							<Text className="textResponsive" ta={{ base: "center", md: "start" }}>
								Lorem ipsum dolor sit amet consectetur adipiscing elit aliquam mauris sed ma
							</Text>

							<Group>
								{dataSocials.map((social) => (
									<Anchor key={social.link} title={social.label} href={social.link}>
										<Group>
											<ThemeIcon size={24} variant="light">
												<social.icon size={16} stroke={iconStrokeWidth} />
											</ThemeIcon>
										</Group>
									</Anchor>
								))}
							</Group>
						</Flex>
					</GridCol>
					<GridCol span={{ base: 12, md: 8, lg: 8.5 }} visibleFrom="sm">
						<Grid gutter={{ base: "xl", md: "md" }}>
							{linkSets.map((linkSet) => (
								<GridCol key={linkSet.title} span={{ base: 6, xs: 4, sm: 3 }}>
									<Flex direction={"column"} align={{ base: "center", md: "end" }} gap={"xs"}>
										<Title order={4} fw={"bold"}>
											{linkSet.title}
										</Title>
										<List listStyleType="none">
											{linkSet.links.map((link) => (
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

			<Container size={"responsive"}>
				<Divider mt={56} mb={"lg"} color="var(--mantine-color-default-border)" />
			</Container>

			<Container size={"responsive"}>
				<Group justify="space-between">
					<Text fz={{ base: "xs", lg: "sm" }} lh={1}>
						<Text component="span" inherit>
							Copyright © {new Date().getFullYear()} {appData.name.app}
						</Text>{" "}
						|{" "}
						<Text component="span" inherit>
							All Rights Reserved
						</Text>{" "}
						|{" "}
						<Anchor inherit href="#tc" className={classes.link}>
							Terms and Conditions
						</Anchor>{" "}
						|{" "}
						<Anchor inherit href="#pp" className={classes.link}>
							Privacy Policy
						</Anchor>
					</Text>

					<ActionIconTheme />
				</Group>
			</Container>
		</LayoutSection>
	);
}

const linkSets = [
	{
		title: "About Us",
		links: [
			{ label: "Mission", link: "#Mission" },
			{ label: "Our Team", link: "#Team" },
			{ label: "Awards", link: "#Awards" },
			{ label: "Testimonials", link: "#Testimonials" },
			{ label: "Privacy Policy", link: "#Policy" },
		],
	},
	{
		title: "Services",
		links: [
			{ label: "Web Design", link: "#Design" },
			{ label: "Web Development", link: "#Development" },
			{ label: "Mobile Design", link: "#Mobile" },
			{ label: "UI/UX Design", link: "#UX" },
			{ label: "Branding Design", link: "#Branding" },
		],
	},
	{
		title: "Portfolio",
		links: [
			{ label: "Corporate Websites", link: "#Corporate" },
			{ label: "E-commerce", link: "#commerce" },
			{ label: "Mobile Apps", link: "#Apps" },
			{ label: "Landing Pages", link: "#Landing" },
			{ label: "UI/UX Projects", link: "#Projects" },
		],
	},
	{
		title: "Contact Us",
		links: [
			{ label: "Information", link: "#Information" },
			{ label: "Request a Quote", link: "#Quote" },
			{ label: "Consultation", link: "#Consultation" },
			{ label: "Help Center", link: "#Help" },
			{ label: "T's and C's", link: "#Terms" },
		],
	},
];
