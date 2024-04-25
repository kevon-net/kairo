import React from "react";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";

import { Group, Box, Container, Image } from "@mantine/core";

import { IconChevronDown } from "@tabler/icons-react";

import asset from "@/assets";
import data from "@/data";
import Component from "@/components";

import classes from "./Main.module.scss";

export default function Main() {
	const pathname = usePathname();

	const navDesktop = data.links.navbar.map(link => (
		<Component.Menu.Navbar key={link.link} subLinks={link.subLinks}>
			{!link.subLinks ? (
				<Link href={link.link} className={`${classes.link} ${pathname == link.link ? classes.linkActive : ""}`}>
					{link.label}
				</Link>
			) : (
				<Link
					href={link.link}
					className={`${classes.link} ${
						pathname == link.link || link.subLinks.find(l => l.link == pathname)
							? classes.linkActive
							: undefined
					}`}
					// onClick={e => e.preventDefault()}
				>
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
			<Container>
				<Group justify="space-between">
					<Link href={"/"}>
						<Group>
							<Image
								src={asset.icon.tool.nextjs}
								alt="next icon"
								className={classes.logo}
								component={NextImage}
								priority
							/>
						</Group>
					</Link>

					<Group gap={"xs"} component={"nav"} visibleFrom="sm">
						{navDesktop}
					</Group>

					<Component.Drawer.Nav.Main
						data={data.links.navbar}
						hiddenFrom="sm"
						aria-label="Toggle Navigation"
					/>
				</Group>
			</Container>
		</Box>
	);
}
