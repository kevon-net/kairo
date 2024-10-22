"use client";

import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import { Group, Box, Image, Button, Divider, Anchor } from "@mantine/core";

import LayoutSection from "@/components/layout/section";
import DrawerNavbarMain from "@/components/common/drawers/navbar/main";
import MenuAvatar from "@/components/common/menus/avatar";
import ActionIconTheme from "@/components/common/buttons/theme";
import MenuNavbar from "@/components/common/menus/navbar";

import sample from "@/data/sample";
import images from "@/data/images";

import appData from "@/data/app";

import { signIn } from "@/handlers/event/sign-in";
import { useSession } from "next-auth/react";
import links from "@/data/links";
import classes from "./main.module.scss";
import { usePathname } from "next/navigation";
import { IconChevronDown } from "@tabler/icons-react";
import { iconStrokeWidth } from "@/data/constants";

export default function Main() {
	const { data: session } = useSession();

	const pathname = usePathname();

	const navLinks = links.navbar.map((link) => (
		<MenuNavbar key={link.link} subLinks={link.subLinks}>
			{!link.subLinks ? (
				<Anchor
					component={Link}
					href={link.link}
					className={`${classes.link} ${
						pathname == link.link ? classes.linkActive : ""
					}`}
				>
					{link.label}
				</Anchor>
			) : (
				<Anchor
					component={Link}
					href={link.link}
					className={`${classes.link} ${
						pathname == link.link ||
						link.subLinks.find((l) => l.link == pathname)
							? classes.linkActive
							: ""
					}`}
					// onClick={e => e.preventDefault()}
				>
					<Group gap={4}>
						<span>{link.label}</span>
						<IconChevronDown
							size={16}
							stroke={iconStrokeWidth}
							style={{ marginTop: 2 }}
						/>
					</Group>
				</Anchor>
			)}
		</MenuNavbar>
	));

	return (
		<LayoutSection id={"partial-navbar-main"} shadowed padded="lg">
			<Group justify="space-between">
				<Group align="end" gap={"lg"}>
					<Box>
						<Link href={"/"}>
							<Group>
								<Image
									src={images.brand.logo.light}
									alt={appData.name.app}
									h={{ base: 24 }}
									component={NextImage}
									width={1920}
									height={1080}
									priority
								/>
							</Group>
						</Link>
					</Box>

					<Divider orientation="vertical" visibleFrom="sm" />

					<Group component={"nav"} visibleFrom="sm">
						{navLinks}
					</Group>
				</Group>

				<Group visibleFrom="sm" gap={"xs"}>
					{!session?.user ? (
						<Button size="xs" variant="light" onClick={signIn}>
							Log In
						</Button>
					) : (
						<MenuAvatar />
					)}

					<Button size="xs">Get in Touch</Button>

					<ActionIconTheme />
				</Group>

				<DrawerNavbarMain props={sample.links.navbar} />
			</Group>
		</LayoutSection>
	);
}
