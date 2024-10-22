"use client";

import React from "react";

import { usePathname } from "next/navigation";

import {
	Burger,
	BurgerProps,
	Button,
	Drawer,
	Group,
	NavLink,
	Stack
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import ActionIconTheme from "@/components/common/buttons/theme";

import classes from "./main.module.scss";

import { typeMenuNavbar } from "@/types/components/menu";

export default function Main({
	props,
	hiddenFrom = "sm"
}: {
	props: typeMenuNavbar[];
	hiddenFrom?: BurgerProps["hiddenFrom"];
}) {
	const [opened, { toggle, close }] = useDisclosure(false);
	const pathname = usePathname();

	const navMobile = props.map((link) => {
		const subLinks =
			link.subLinks &&
			link.subLinks.map((subLink) => (
				<NavLink
					key={subLink.link}
					href={subLink.link}
					label={subLink.label}
					active={pathname == subLink.link}
					onClick={close}
				/>
			));

		return !subLinks ? (
			<NavLink
				key={link.link}
				href={link.link}
				label={link.label}
				active={pathname == link.link}
				onClick={close}
				fw={pathname == link.link ? 500 : undefined}
				leftSection={
					link.leftSection ? (
						<link.leftSection size={14} />
					) : undefined
				}
				rightSection={
					link.rightSection ? (
						<link.rightSection size={14} />
					) : undefined
				}
			/>
		) : (
			<NavLink
				key={link.link}
				href={link.link}
				label={link.label}
				active={pathname == link.link}
				fw={pathname == link.link ? 500 : undefined}
				onClick={close}
				opened={
					pathname == link.link ||
					link.subLinks?.find((sl) => sl.link == pathname)?.link ==
						pathname
						? true
						: undefined
				}
				leftSection={
					link.leftSection ? (
						<link.leftSection size={14} />
					) : undefined
				}
				rightSection={
					link.rightSection ? (
						<link.rightSection size={14} />
					) : undefined
				}
			>
				{subLinks}
			</NavLink>
		);
	});

	return (
		<>
			<Drawer
				opened={opened}
				onClose={close}
				withCloseButton={false}
				size={"200"}
				classNames={{
					body: classes.body,
					header: classes.header
				}}
			>
				<Stack>
					<Stack gap={0}>{navMobile}</Stack>

					<Stack gap={"xs"} px={"xs"}>
						<Button size="xs" variant="light">
							Log In
						</Button>

						<Group gap={"xs"} grow preventGrowOverflow={false}>
							<Button size="xs" w={"75%"}>
								Get in Touch
							</Button>

							<ActionIconTheme />
						</Group>
					</Stack>
				</Stack>
			</Drawer>

			<Burger
				opened={opened}
				onClick={toggle}
				size={"sm"}
				aria-label="Toggle Navigation"
				color="pri"
				hiddenFrom={hiddenFrom}
			/>
		</>
	);
}
