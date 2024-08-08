"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Divider, NavLink, Stack } from "@mantine/core";
import {
	IconBellRinging,
	IconChevronRight,
	IconCoins,
	IconLogout,
	IconMapPin,
	IconSettings,
	IconUser,
} from "@tabler/icons-react";

import LayoutSection from "@/layouts/Section";

import { signOut } from "next-auth/react";

export default function User() {
	const pathname = usePathname();

	const navLinkItems = [
		{
			icon: IconUser,
			link: `/account/profile`,
			label: "Profile Settings",
		},
		{
			icon: IconCoins,
			link: `/account/payment`,
			label: "Payment Details",
		},
		{
			icon: IconMapPin,
			link: `/account/addresses`,
			label: "Shipping Addresses",
		},
		{
			icon: IconSettings,
			link: `/account/settings`,
			label: "Account Settings",
		},
		{
			icon: IconBellRinging,
			link: `/account/notifications`,
			label: "Notifications",
		},
	];

	return (
		<LayoutSection padded>
			<Stack>
				<Stack gap={0}>
					{navLinkItems.map(item => (
						<NavLink
							key={item.label}
							component={Link}
							href={item.link}
							label={item.label}
							leftSection={<item.icon size={16} />}
							rightSection={<IconChevronRight size={16} />}
							active={item.link == pathname}
							style={{ borderRadius: "var(--mantine-radius-sm)" }}
						/>
					))}
				</Stack>

				<Divider />

				<NavLink
					label={"Log Out"}
					active
					color="red.6"
					leftSection={<IconLogout size={16} />}
					style={{ borderRadius: "var(--mantine-radius-sm)" }}
					onClick={async () => await signOut()}
				/>
			</Stack>
		</LayoutSection>
	);
}
