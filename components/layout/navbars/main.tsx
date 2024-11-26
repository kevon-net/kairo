"use client";

import React from "react";

import Link from "next/link";

import { Group, Button, Divider, Anchor, Grid, GridCol } from "@mantine/core";

import LayoutSection from "@/components/layout/section";
import DrawerNavbarMain from "@/components/common/drawers/navbar/main";
import MenuAvatar from "@/components/common/menus/avatar";
import MenuNavbar from "@/components/common/menus/navbar";
import DrawerUser from "@/components/common/drawers/user";
import LayoutBrand from "../brand";
import { SignIn as FragmentSignIn } from "@/components/common/fragments/auth";

import links from "@/data/links";
import classes from "./main.module.scss";
import { IconChevronDown } from "@tabler/icons-react";
import { authUrls, iconSize, iconStrokeWidth } from "@/data/constants";
import { useMediaQuery } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/redux";

export default function Main() {
	const session = useAppSelector((state) => state.session.value);
	const pathname = usePathname();
	const desktop = useMediaQuery("(min-width: 62em)");

	const navLinks = links.navbar.map((link) => (
		<MenuNavbar key={link.link} subLinks={link.subLinks}>
			{!link.subLinks ? (
				<Anchor
					component={Link}
					href={link.link}
					className={`${classes.link} ${
						pathname == link.link || (link.link != "/" && pathname.includes(link.link))
							? classes.linkActive
							: ""
					}`}
				>
					{link.label}
				</Anchor>
			) : (
				<Anchor
					component={Link}
					href={link.link}
					className={`${classes.link} ${
						pathname == link.link || link.subLinks.find((l) => l.link == pathname) ? classes.linkActive : ""
					}`}
					onClick={(e) => e.preventDefault()}
				>
					<Group gap={4}>
						<span>{link.label}</span>
						<IconChevronDown size={iconSize} stroke={iconStrokeWidth} style={{ marginTop: 2 }} />
					</Group>
				</Anchor>
			)}
		</MenuNavbar>
	));

	return (
		<LayoutSection id={"partial-navbar-main"} shadowed>
			<Grid align="center" gutter={0}>
				<GridCol span={{ base: 4, sm: 8 }}>
					<Group gap={"lg"} visibleFrom="sm">
						<Anchor component={Link} href={"/"}>
							<LayoutBrand />
						</Anchor>

						<Divider orientation="vertical" h={24} my={"auto"} />

						<Group component={"nav"}>{navLinks}</Group>
					</Group>

					<Group hiddenFrom="sm" gap={"xs"} justify="space-between">
						<DrawerNavbarMain props={links.navbar} />
					</Group>
				</GridCol>

				<GridCol span={{ base: 4 }} hiddenFrom="sm">
					<Group gap={"xs"} justify="center">
						<Anchor component={Link} href={"/"} py={"md"}>
							<LayoutBrand />
						</Anchor>
					</Group>
				</GridCol>

				<GridCol span={{ base: 4 }}>
					<Group justify="end">
						{!session ? (
							<Group gap={"xs"}>
								<Button size="xs" component={Link} href={authUrls.signUp} visibleFrom="sm">
									Sign Up
								</Button>

								<FragmentSignIn>
									<Button size="xs" variant="light">
										Log In
									</Button>
								</FragmentSignIn>
							</Group>
						) : desktop ? (
							<MenuAvatar />
						) : (
							<DrawerUser />
						)}
					</Group>
				</GridCol>
			</Grid>
		</LayoutSection>
	);
}
