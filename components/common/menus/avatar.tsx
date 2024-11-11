"use client";

import React from "react";

import Link from "next/link";

import { Menu, MenuDivider, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Text, Stack, Skeleton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import AvatarMain from "../avatars/main";

import classes from "./avatar.module.scss";
import { navLinkItems } from "@/components/layout/asides/account";
import { useSession } from "@/hooks/auth";
import { getRegionalDate } from "@/utilities/formatters/date";

export default function Avatar() {
	const { session } = useSession();

	const mobile = useMediaQuery("(max-width: 48em)");

	return (
		<Menu position={"bottom"} withArrow width={mobile ? 200 : 240} trigger="click-hover" classNames={classes}>
			<MenuTarget>
				<div>
					<AvatarMain size={40} />
				</div>
			</MenuTarget>

			<MenuDropdown>
				<Stack gap={"xs"} align="center" p={"sm"}>
					{!session ? (
						<Skeleton height={8} radius="xl" />
					) : (
						session && (
							<Stack gap={"xs"}>
								<Text fz={"sm"} lh={1} ta={"center"}>
									{session.user.name}
								</Text>
								<Text fz={"xs"} lh={1} ta={"center"}>
									({session.user.email})
								</Text>

								{/* <Text fz={"xs"} lh={1} ta={"center"}>
									({getRegionalDate(session.expires)})
								</Text> */}
							</Stack>
						)
					)}
				</Stack>

				{session && <MenuDivider />}

				<MenuLabel>Activity</MenuLabel>
				{navLinkItems.activity.map((item) => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))}

				<MenuDivider />

				<MenuLabel>Account</MenuLabel>
				{navLinkItems.account.map((item) => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))}

				<MenuDivider />

				<MenuLabel>Support</MenuLabel>
				{navLinkItems.support.map((item) => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))}

				<MenuDivider />

				{navLinkItems.danger.map((item) => (
					<MenuItem
						key={item.label}
						leftSection={<item.icon size={16} />}
						component={Link}
						href={item.link}
						color={item.color}
					>
						{item.label}
					</MenuItem>
				))}
			</MenuDropdown>
		</Menu>
	);
}
