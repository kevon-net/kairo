"use client";

import React from "react";

import Link from "next/link";

import { Menu, MenuDivider, MenuDropdown, MenuItem, MenuTarget, Text, Stack, Skeleton, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import AvatarMain from "../avatars/main";

import classes from "./avatar.module.scss";
import { navLinkItems } from "@/components/layout/asides/account";
import { getRegionalDate } from "@/utilities/formatters/date";
import { IconSettings } from "@tabler/icons-react";
import { iconSize, iconStrokeWidth } from "@/data/constants";
import { useAppSelector } from "@/hooks/redux";

export default function Avatar() {
	const session = useAppSelector((state) => state.session.value);

	const mobile = useMediaQuery("(max-width: 48em)");
	const desktop = useMediaQuery("(min-width: 62em)");

	return (
		<Menu
			position={"bottom-end"}
			withArrow
			arrowOffset={24}
			width={mobile ? 200 : 240}
			trigger="click-hover"
			classNames={classes}
			opened={desktop ? undefined : false}
		>
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
								<Title order={3} fz={"md"} lh={1} ta={"center"}>
									{session.user.name}
								</Title>
								<Text fz={"sm"} lh={1} ta={"center"}>
									{session.user.email}
								</Text>

								{/* <Text fz={"xs"} lh={1} ta={"center"}>
									({getRegionalDate(session.expires)})
								</Text> */}
							</Stack>
						)
					)}
				</Stack>

				<MenuDivider />

				<MenuItem
					leftSection={<IconSettings size={iconSize} stroke={iconStrokeWidth} />}
					component={Link}
					href={"/account/profile"}
				>
					Manage Account
				</MenuItem>

				{navLinkItems.danger.map((item) => (
					<MenuItem
						key={item.label}
						leftSection={<item.icon size={iconSize} stroke={iconStrokeWidth} />}
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
