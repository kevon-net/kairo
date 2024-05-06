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
	Stack,
	Skeleton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import {
	IconSettings,
	IconUser,
	IconLogout,
	IconPackage,
	IconCoins,
	IconMapPin,
	IconBellRinging,
	IconDashboard,
} from "@tabler/icons-react";

import classes from "./Avatar.module.scss";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import handler from "@/handlers";
import Link from "next/link";

export default function Avatar() {
	const { data: session, status } = useSession({ required: true });
	const mobile = useMediaQuery("(max-width: 48em)");

	const sizeAvatar = mobile ? 28 : 36;

	const menuItems = {
		app: [
			{
				icon: IconDashboard,
				link: `/${session?.user.id}/dashboard`,
				label: "Overview",
			},
			{
				icon: IconPackage,
				link: `/${session?.user.id}/dashboard/orders`,
				label: "My Orders",
			},
		],
		user: [
			{
				icon: IconUser,
				link: `/${session?.user.id}/settings/profile`,
				label: "Profile Settings",
			},
			{
				icon: IconCoins,
				link: `/${session?.user.id}/settings/payment`,
				label: "Payment Details",
			},
			{
				icon: IconMapPin,
				link: `/${session?.user.id}/settings/addresses`,
				label: "Shipping Addresses",
			},
			{
				icon: IconSettings,
				link: `/${session?.user.id}/settings/account`,
				label: "Account Settings",
			},
			{
				icon: IconBellRinging,
				link: `/${session?.user.id}/settings/notifications`,
				label: "Notifications",
			},
		],
		danger: [
			{
				icon: IconLogout,
				label: "Log Out",
				color: "red",
			},
		],
	};

	return (
		<Menu position={"bottom-end"} withArrow classNames={{ dropdown: classes.dropdown }} width={mobile ? 200 : 240}>
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
					{/* <Text fz={"sm"} lh={1} c={"dimmed"}>
						{session?.user?.id}
					</Text>
					<Text fz={"sm"} lh={1} c={"dimmed"}>
						{session?.user?.role}
					</Text>
					<Text fz={"sm"} lh={1} c={"dimmed"}>
						{session?.expires}
					</Text> */}
				</Stack>

				<MenuDivider />

				<MenuLabel>Dashboard</MenuLabel>
				{menuItems.app.map(item => (
					<MenuItem
						key={item.label}
						leftSection={<item.icon size={16} />}
						color={item.color ? item.color : undefined}
						component={Link}
						href={item.link}
					>
						{item.label}
					</MenuItem>
				))}

				<MenuDivider />

				<MenuLabel>Account</MenuLabel>
				{menuItems.user.map(item => (
					<MenuItem
						key={item.label}
						leftSection={<item.icon size={16} />}
						color={item.color ? item.color : undefined}
						component={Link}
						href={item.link}
					>
						{item.label}
					</MenuItem>
				))}

				<MenuDivider />

				{menuItems.danger.map(item => (
					<MenuItem
						key={item.label}
						leftSection={<item.icon size={16} />}
						color={item.color}
						onClick={async () => await signOut()}
					>
						{item.label}
					</MenuItem>
				))}
			</MenuDropdown>
		</Menu>
	);
}
