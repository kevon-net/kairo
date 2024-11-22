"use client";

import React from "react";

import Link from "next/link";

import { Divider, NavLink, Stack, Title } from "@mantine/core";
import {
	IconBellRinging,
	IconChevronRight,
	IconHeart,
	IconHelpCircle,
	IconInfoCircle,
	IconLicense,
	IconLock,
	IconLogout,
	IconPackage,
	IconStar,
	IconUser,
} from "@tabler/icons-react";

import LayoutSection from "@/components/layout/section";
import PartialUser from "@/components/partial/user";

import { authUrls, iconSize, iconStrokeWidth } from "@/data/constants";
import { usePathname } from "next/navigation";

export default function Account() {
	const pathname = usePathname();

	return (
		<LayoutSection containerized={false} id={"partial-aside-user"} padded pos={"sticky"} top={0}>
			<Stack gap={48} align="center">
				<PartialUser />

				<Stack w={"100%"}>
					{/* <Stack gap={"xs"}>
						<Title order={3} fz={"md"} ml={{ md: "sm" }}>
							Activity
						</Title>

						<Stack gap={4}>
							{navLinkItems.activity.map((item) => (
								<NavLink
									key={item.label}
									component={Link}
									href={item.link}
									label={item.label}
									leftSection={<item.icon size={16} stroke={iconStrokeWidth} />}
									rightSection={<IconChevronRight size={16} />}
									active={item.link == pathname}
									style={{
										borderRadius: "var(--mantine-radius-md)",
									}}
								/>
							))}
						</Stack>
					</Stack>

					<Divider /> */}

					<Stack gap={"xs"}>
						<Title order={3} fz={"md"} ml={{ md: "sm" }}>
							Account
						</Title>

						<Stack gap={4}>
							{navLinkItems.account.map((item) => (
								<NavLink
									key={item.label}
									component={Link}
									href={item.link}
									label={item.label}
									leftSection={<item.icon size={iconSize} stroke={iconStrokeWidth} />}
									rightSection={<IconChevronRight size={iconSize} stroke={iconStrokeWidth} />}
									active={item.link == pathname}
									style={{
										borderRadius: "var(--mantine-radius-md)",
									}}
								/>
							))}
						</Stack>
					</Stack>

					<Divider />

					<Stack gap={"xs"}>
						<Title order={3} fz={"md"} ml={{ md: "sm" }}>
							Support
						</Title>

						<Stack gap={4}>
							{navLinkItems.support.map((item) => (
								<NavLink
									key={item.label}
									component={Link}
									href={item.link}
									label={item.label}
									leftSection={<item.icon size={iconSize} stroke={iconStrokeWidth} />}
									rightSection={<IconChevronRight size={iconSize} stroke={iconStrokeWidth} />}
									active={item.link == pathname}
									style={{
										borderRadius: "var(--mantine-radius-md)",
									}}
								/>
							))}
						</Stack>
					</Stack>

					<Divider />

					<Stack gap={4}>
						{navLinkItems.danger.map((item) => (
							<NavLink
								key={item.label}
								component={"a"}
								href={item.link}
								label={item.label}
								color={item.color}
								leftSection={<item.icon size={iconSize} stroke={iconStrokeWidth} />}
								rightSection={<IconChevronRight size={iconSize} stroke={iconStrokeWidth} />}
								style={{
									borderRadius: "var(--mantine-radius-md)",
								}}
								active
							/>
						))}
					</Stack>
				</Stack>
			</Stack>
		</LayoutSection>
	);
}

export const navLinkItems = {
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
	account: [
		{
			icon: IconUser,
			link: `/account/profile`,
			label: "Profile Settings",
		},
		{
			icon: IconLock,
			link: `/account/security`,
			label: "Account Security",
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
	support: [
		{
			icon: IconHelpCircle,
			link: `/help`,
			label: "Help Center",
		},
		{
			icon: IconLicense,
			link: `/legal/terms-and-conditions`,
			label: "Terms and Conditions",
		},
		{
			icon: IconInfoCircle,
			link: `/legal/privacy-policy`,
			label: "Privacy Policy",
		},
	],
	danger: [
		{
			icon: IconLogout,
			link: authUrls.signOut,
			label: "Sign Out",
			color: "red.6",
		},
	],
};
