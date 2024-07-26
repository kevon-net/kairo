"use client";

import React from "react";

import Link from "next/link";

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

import initialize from "@/handlers/parsers/string/initialize";

import { useSession } from "next-auth/react";

export default function Avatar() {
	const session = useSession();

	const mobile = useMediaQuery("(max-width: 48em)");

	const sizeAvatar = mobile ? 28 : 36;

	const user = session.data?.user;

	const menuItems = {
		app: [
			{
				icon: IconDashboard,
				link: `/dashboard`,
				label: "Overview",
			},
			{
				icon: IconPackage,
				link: `/dashboard/orders`,
				label: "My Orders",
			},
		],
		user: [
			{
				icon: IconUser,
				link: `/account/settings/profile`,
				label: "Profile Settings",
			},
			{
				icon: IconCoins,
				link: `/account/settings/payment`,
				label: "Payment Details",
			},
			{
				icon: IconMapPin,
				link: `/account/settings/addresses`,
				label: "Shipping Addresses",
			},
			{
				icon: IconSettings,
				link: `/account/settings`,
				label: "Account Settings",
			},
			{
				icon: IconBellRinging,
				link: `/account/settings/notifications`,
				label: "Notifications",
			},
		],
		danger: [
			{
				icon: IconLogout,
				link: `/api/auth/signout`,
				label: "Sign Out",
				color: "red",
			},
		],
	};

	return (
		<Menu position={"bottom-end"} withArrow classNames={{ dropdown: classes.dropdown }} width={mobile ? 200 : 240}>
			<MenuTarget>
				{user ? (
					!user?.image ? (
						<MantineAvatar
							size={sizeAvatar}
							title={user.name ? user.name : "User"}
							className={classes.avatar}
						>
							{user.name ? initialize(user?.name) : user.email?.charAt(0).toUpperCase()}
						</MantineAvatar>
					) : (
						<MantineAvatar
							src={user.image}
							alt={user.name ? user.name : "User"}
							size={sizeAvatar}
							title={user.name ? user.name : "User"}
							className={classes.avatar}
						/>
					)
				) : (
					<span></span>
				)}
			</MenuTarget>

			<MenuDropdown>
				<Stack gap={"xs"} align="center" p={"sm"}>
					{session.status == "loading" ? (
						<Skeleton height={8} radius="xl" />
					) : (
						<Stack gap={"xs"}>
							{user?.name && (
								<Text fz={"sm"} lh={1} ta={"center"}>
									{user?.name}
								</Text>
							)}
							<Text fz={"xs"} lh={1} ta={"center"}>
								({user?.email})
							</Text>

							{/* test expiry session */}
							{/* <Text fz={"xs"} lh={1} ta={"center"}>
								({session.data?.expires})
							</Text> */}
						</Stack>
					)}
				</Stack>

				<MenuDivider />

				<MenuLabel>Dashboard</MenuLabel>
				{menuItems.app.map(item => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))}

				<MenuDivider />

				<MenuLabel>Account</MenuLabel>
				{menuItems.user.map(item => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))}

				<MenuDivider />

				{menuItems.danger.map(item => (
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
