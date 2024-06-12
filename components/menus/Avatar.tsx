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

export default function Avatar() {
	// const { isLoaded, isSignedIn, user } = useUser();

	const mobile = useMediaQuery("(max-width: 48em)");

	const sizeAvatar = mobile ? 28 : 36;

	const menuItems = {
		app: [
			{
				icon: IconDashboard,
				link: `/${user?.id}/dashboard`,
				label: "Overview",
			},
			{
				icon: IconPackage,
				link: `/${user?.id}/dashboard/orders`,
				label: "My Orders",
			},
		],
		user: [
			{
				icon: IconUser,
				link: `/${user?.id}/settings/profile`,
				label: "Profile Settings",
			},
			{
				icon: IconCoins,
				link: `/${user?.id}/settings/payment`,
				label: "Payment Details",
			},
			{
				icon: IconMapPin,
				link: `/${user?.id}/settings/addresses`,
				label: "Shipping Addresses",
			},
			{
				icon: IconSettings,
				link: `/${user?.id}/settings/account`,
				label: "Account Settings",
			},
			{
				icon: IconBellRinging,
				link: `/${user?.id}/settings/notifications`,
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
				{user ? (
					!user?.imageUrl ? (
						<MantineAvatar
							size={sizeAvatar}
							title={user.fullName ? user.fullName : "User"}
							className={classes.avatar}
						>
							{user.fullName ? initialize(user?.fullName) : "FN"}
						</MantineAvatar>
					) : (
						<MantineAvatar
							src={user.imageUrl}
							alt={user.fullName ? user.fullName : "User"}
							size={sizeAvatar}
							title={user.fullName ? user.fullName : "User"}
							className={classes.avatar}
						/>
					)
				) : (
					<div></div>
				)}
				<div>auth</div>
			</MenuTarget>

			<MenuDropdown>
				<Stack gap={"xs"} align="center" p={"sm"}>
					{!isLoaded ? (
						<Skeleton height={8} radius="xl" />
					) : (
						<Text fz={"sm"} lh={1}>
							{user?.fullName}
						</Text>
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
					<SignOutButton key={item.label}>
						<MenuItem leftSection={<item.icon size={16} />} color={item.color}>
							{item.label}
						</MenuItem>
					</SignOutButton>
				))}
			</MenuDropdown>
		</Menu>
	);
}
