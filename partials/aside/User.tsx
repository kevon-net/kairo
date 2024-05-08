"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Divider, NavLink, Stack, Text } from "@mantine/core";
import {
	IconBellRinging,
	IconChevronRight,
	IconCoins,
	IconLogout,
	IconMapPin,
	IconSettings,
	IconUser,
} from "@tabler/icons-react";

import Layout from "@/layouts";

// import { signOut, useSession } from "next-auth/react";

export default function User() {
	// const { data: session } = useSession({ required: true });

	const pathname = usePathname();

	// const navLinkItems = [
	// 	{
	// 		icon: IconUser,
	// 		link: `/${session?.user.id}/settings/profile`,
	// 		label: "Profile Settings",
	// 	},
	// 	{
	// 		icon: IconCoins,
	// 		link: `/${session?.user.id}/settings/payment`,
	// 		label: "Payment Details",
	// 	},
	// 	{
	// 		icon: IconMapPin,
	// 		link: `/${session?.user.id}/settings/addresses`,
	// 		label: "Shipping Addresses",
	// 	},
	// 	{
	// 		icon: IconSettings,
	// 		link: `/${session?.user.id}/settings/account`,
	// 		label: "Account Settings",
	// 	},
	// 	{
	// 		icon: IconBellRinging,
	// 		link: `/${session?.user.id}/settings/notifications`,
	// 		label: "Notifications",
	// 	},
	// ];

	return (
		<Layout.Section padded>
			<Stack>
				{/* <Stack gap={0}>
					{navLinkItems.map(item => (
						<NavLink
							key={item.label}
							component={Link}
							href={item.link}
							label={item.label}
							leftSection={<item.icon size={16} />}
							rightSection={<IconChevronRight size={16} />}
							active={item.link == pathname}
						/>
					))}
				</Stack> */}

				<Divider />

				<NavLink
					label={"Log Out"}
					active
					color="red.6"
					leftSection={<IconLogout size={16} />}
					// onClick={async () => await signOut()}
				/>
			</Stack>
		</Layout.Section>
	);
}
