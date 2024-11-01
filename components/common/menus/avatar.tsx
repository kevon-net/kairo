"use client";

import React from "react";

import Link from "next/link";

import { Menu, MenuDivider, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Text, Stack, Skeleton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import {
	IconUser,
	IconLogout,
	IconPackage,
	IconBellRinging,
	IconHeart,
	IconStar,
	IconHelpCircle,
	IconInfoCircle,
} from "@tabler/icons-react";

import { useSession } from "next-auth/react";

import AvatarMain from "../avatars/main";

import classes from "./avatar.module.scss";

export default function Avatar() {
	const { data: session, status } = useSession();
	const userName = session?.user.name;

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
					{status == "loading" ? (
						<Skeleton height={8} radius="xl" />
					) : (
						session && (
							<Stack gap={"xs"}>
								{userName && (
									<Text fz={"sm"} lh={1} ta={"center"}>
										{userName}
									</Text>
								)}
								<Text fz={"xs"} lh={1} ta={"center"}>
									({session.user.email})
								</Text>

								{/* <Text fz={"xs"} lh={1} ta={"center"}>
									({session.expires})
								</Text> */}
							</Stack>
						)
					)}
				</Stack>

				{session && <MenuDivider />}

				{/* <MenuLabel>Activity</MenuLabel>
				{menuItems.activity.map(item => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))}

				<MenuDivider /> */}

				<MenuLabel>Account</MenuLabel>
				{menuItems.user.map((item) => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))}

				{/* <MenuDivider />

				<MenuLabel>Customer Care</MenuLabel>
				{menuItems.help.map(item => (
					<MenuItem key={item.label} leftSection={<item.icon size={16} />} component={Link} href={item.link}>
						{item.label}
					</MenuItem>
				))} */}

				<MenuDivider />

				{menuItems.danger.map((item) => (
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

const menuItems = {
	activity: [
		{
			icon: IconHeart,
			link: `/account/wishlist`,
			label: "My Wishlist",
		},
		{
			icon: IconPackage,
			link: `/account/orders`,
			label: "My Orders",
		},
		{
			icon: IconStar,
			link: `/account/reviews`,
			label: "My Reviews",
		},
	],
	user: [
		{
			icon: IconUser,
			link: `/profile`,
			label: "Profile Settings",
		},
		// {
		// 	icon: IconCoins,
		// 	link: `/account/payment`,
		// 	label: "Payment Details",
		// },
		// {
		// 	icon: IconMapPin,
		// 	link: `/account/addresses`,
		// 	label: "Addresses",
		// },
		{
			icon: IconBellRinging,
			link: `/account/notifications`,
			label: "Notifications",
		},
	],
	help: [
		{
			icon: IconHelpCircle,
			link: `/help`,
			label: "Help Center",
		},
		{
			icon: IconInfoCircle,
			link: `/legal/terms-and-conditions`,
			label: "Terms and Conditions",
		},
	],
	danger: [
		{
			icon: IconLogout,
			link: process.env.NEXT_PUBLIC_URL_SIGN_OUT!,
			label: "Sign Out",
			color: "red",
		},
	],
};
