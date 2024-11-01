"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Divider, Flex, NavLink, Stack, Text, Title } from "@mantine/core";
import {
	IconBellRinging,
	IconChevronRight,
	IconHeart,
	IconHelpCircle,
	IconInfoCircle,
	IconLogout,
	IconPackage,
	IconStar,
	IconUser,
} from "@tabler/icons-react";

import LayoutSection from "@/components/layout/section";
import AvatarMain from "@/components/common/avatars/main";

import { useSession } from "next-auth/react";
import { iconStrokeWidth } from "@/data/constants";

export default function User() {
	const pathname = usePathname();
	const { data: session } = useSession();

	const navLinkItems = {
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
				link: `/account/profile`,
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
				link: `/help/terms-and-conditions`,
				label: "Terms and Conditions",
			},
		],
		danger: [
			{
				icon: IconLogout,
				link: `/api/auth/signout`,
				label: "Sign Out",
				color: "red.6",
			},
		],
	};

	return (
		<LayoutSection id={"partial-aside-user"} padded pos={"sticky"} top={0}>
			<Stack gap={48} align="center">
				<Flex
					direction={{ base: "column", lg: "row" }}
					align={"center"}
					justify={"center"}
					gap={"md"}
					w={"100%"}
				>
					<AvatarMain />

					<Stack gap={0}>
						<Title order={3} fz={"md"} ta={{ base: "center", lg: "start" }}>
							{session?.user.name}
						</Title>

						<Text fz={"xs"} c={"dimmed"} ta={{ base: "center", lg: "start" }}>
							{session?.user.email}
						</Text>
					</Stack>
				</Flex>

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
							{navLinkItems.user.map((item) => (
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

					<Divider />

					{/* <Stack gap={"xs"}>
						<Title order={3} fz={"md"} ml={{ md: "sm" }}>
							Customer Care
						</Title>

						<Stack gap={4}>
							{navLinkItems.help.map((item) => (
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

					<Stack gap={4}>
						{navLinkItems.danger.map((item) => (
							<NavLink
								key={item.label}
								component={"a"}
								href={item.link}
								label={item.label}
								color={item.color}
								leftSection={<item.icon size={16} stroke={iconStrokeWidth} />}
								rightSection={<IconChevronRight size={16} />}
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
