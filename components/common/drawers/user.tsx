"use client";

import React from "react";

import { Box, Drawer, NavLink, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import MenuAvatar from "@/components/common/menus/avatar";
import PartialUser from "@/components/partial/user";

import classes from "./user.module.scss";
import { navLinkItems } from "@/components/layout/asides/account";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { iconSize, iconStrokeWidth } from "@/data/constants";

export default function User() {
	const [opened, { toggle, close }] = useDisclosure(false);
	const pathname = usePathname();

	return (
		<>
			<Drawer
				opened={opened}
				onClose={close}
				withCloseButton={false}
				position="right"
				transitionProps={{ transition: "slide-left" }}
				size={240}
				classNames={{ body: classes.body, header: classes.header }}
			>
				<Stack>
					<PartialUser />

					<Stack gap={0}>
						{navLinkItems.account.map((link) => (
							<NavLink
								key={link.link}
								component={Link}
								href={link.link}
								label={link.label}
								active={pathname == link.link || (link.link != "/" && pathname.includes(link.link))}
								onClick={close}
								fw={pathname == link.link ? 500 : undefined}
								leftSection={<link.icon size={iconSize} stroke={iconStrokeWidth} />}
							/>
						))}

						{navLinkItems.support.map((link) => (
							<NavLink
								key={link.link}
								component={Link}
								href={link.link}
								label={link.label}
								active={pathname == link.link || (link.link != "/" && pathname.includes(link.link))}
								onClick={close}
								fw={pathname == link.link ? 500 : undefined}
								leftSection={<link.icon size={iconSize} stroke={iconStrokeWidth} />}
							/>
						))}

						{navLinkItems.danger.map((link) => (
							<NavLink
								key={link.link}
								component={Link}
								href={link.link}
								label={link.label}
								active={pathname == link.link || (link.link != "/" && pathname.includes(link.link))}
								onClick={close}
								fw={pathname == link.link ? 500 : undefined}
								leftSection={<link.icon size={iconSize} stroke={iconStrokeWidth} />}
							/>
						))}
					</Stack>
				</Stack>
			</Drawer>

			<Box onClick={toggle} aria-label="Toggle User Navbar" style={{ cursor: "pointer" }}>
				<MenuAvatar />
			</Box>
		</>
	);
}
