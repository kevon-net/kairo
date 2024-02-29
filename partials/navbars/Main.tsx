"use client";

import React from "react";

import Link from "next/link";

import { Group, Box, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";

import asset from "@/assets";
import data from "@/data";
import Component from "@/components";

import classes from "./Main.module.scss";

export default function Main() {
	const navDesktop = data.links.navbar.map(link => (
		<Component.Menu.Navbar key={link.link} subLinks={link.subLinks}>
			{!link.subLinks ? (
				<Link href={link.link} className={classes.link}>
					{link.label}
				</Link>
			) : (
				<Link href={link.link} className={classes.link} onClick={e => e.preventDefault()}>
					<Group gap={4}>
						<span>{link.label}</span>
						<IconChevronDown size={16} stroke={1.5} />
					</Group>
				</Link>
			)}
		</Component.Menu.Navbar>
	));

	return (
		<Box className={classes.navbar}>
			<Component.Container.Responsive>
				<Group justify="space-between">
					<Link href={"/"}>
						<Component.Media.Image src={asset.icon.software.code} alt="vscode" width={32} height={32} />
					</Link>
					<Group gap={"xs"} component={"nav"} visibleFrom="sm">
						{navDesktop}
					</Group>

					<Component.Drawer.Nav.Main size="sm" hiddenFrom="sm" />
				</Group>
			</Component.Container.Responsive>
		</Box>
	);
}
