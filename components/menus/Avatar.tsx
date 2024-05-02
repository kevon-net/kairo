"use client";

import React from "react";

import {
	Menu,
	MenuDivider,
	MenuDropdown,
	MenuItem,
	MenuLabel,
	MenuTarget,
	Avatar as MantineAvatar,
	Text,
	rem,
	Stack,
	Skeleton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { IconSettings, IconUser, IconLogout } from "@tabler/icons-react";

import classes from "./Avatar.module.scss";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import handler from "@/handlers";

export default function Avatar() {
	const { data: session, status } = useSession({ required: true });
	const mobile = useMediaQuery("(max-width: 48em)");

	const sizeAvatar = mobile ? 28 : 36;

	return (
		<Menu position={"bottom-end"} withArrow classNames={{ dropdown: classes.dropdown }}>
			<MenuTarget>
				{status == "loading" ? (
					<Skeleton height={sizeAvatar} circle />
				) : session.user.image ? (
					<MantineAvatar
						size={sizeAvatar}
						src={session?.user?.image}
						alt={session ? `${session.user?.name}` : "Avatar"}
						className={classes.avatar}
					/>
				) : (
					<MantineAvatar size={sizeAvatar} className={classes.avatar}>
						{handler.parser.string.initialize(session.user.name)}
					</MantineAvatar>
				)}
			</MenuTarget>

			<MenuDropdown>
				<Stack gap={"xs"} align="center" p={"sm"}>
					{status == "loading" ? (
						<Skeleton height={8} radius="xl" />
					) : (
						<Text fz={"sm"} lh={1}>
							{session?.user?.name}
						</Text>
					)}
					{status == "loading" ? (
						<Skeleton height={8} radius="xl" />
					) : (
						<Text fz={"sm"} lh={1} c={"dimmed"}>
							{session?.user?.email}
						</Text>
					)}
					<Text fz={"sm"} lh={1} c={"dimmed"}>
						{session?.user?.id}
					</Text>
					<Text fz={"sm"} lh={1} c={"dimmed"}>
						{session?.user?.role}
					</Text>
					<Text fz={"sm"} lh={1} c={"dimmed"}>
						{session?.expires}
					</Text>
				</Stack>

				<MenuDivider />

				<MenuLabel>Application</MenuLabel>
				<MenuItem leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}>Profile</MenuItem>

				<MenuDivider />

				<MenuLabel>Account</MenuLabel>
				<MenuItem leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
					Account Settings
				</MenuItem>
				<MenuItem
					color="red"
					leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
					onClick={async () => await signOut()}
				>
					Sign Out
				</MenuItem>
			</MenuDropdown>
		</Menu>
	);
}
