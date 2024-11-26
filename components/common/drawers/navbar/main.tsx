"use client";

import React from "react";

import Link from "next/link";

import { Burger, Button, Drawer, NavLink, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SignIn as FragmentSignIn } from "../../fragments/auth";

import classes from "./main.module.scss";

import { typeMenuNavbar } from "@/types/components/menu";
import { iconSize, iconStrokeWidth } from "@/data/constants";
import { useAppSelector } from "@/hooks/redux";
import { usePathname } from "next/navigation";

export default function Main({ props }: { props: typeMenuNavbar[] }) {
	const [opened, { toggle, close }] = useDisclosure(false);
	const session = useAppSelector((state) => state.session.value);
	const pathname = usePathname();

	const navMobile = props.map((link) => {
		const subLinks =
			link.subLinks &&
			link.subLinks.map((subLink) => (
				<NavLink
					key={subLink.link}
					component={Link}
					href={subLink.link}
					label={subLink.label}
					active={pathname == subLink.link}
					onClick={close}
				/>
			));

		return !subLinks ? (
			<NavLink
				key={link.link}
				component={Link}
				href={link.link}
				label={link.label}
				active={pathname == link.link || (link.link != "/" && pathname.includes(link.link))}
				onClick={close}
				fw={pathname == link.link ? 500 : undefined}
				leftSection={
					link.leftSection ? <link.leftSection size={iconSize} stroke={iconStrokeWidth} /> : undefined
				}
				rightSection={
					link.rightSection ? <link.rightSection size={iconSize} stroke={iconStrokeWidth} /> : undefined
				}
			/>
		) : (
			<NavLink
				key={link.link}
				component={Link}
				href={link.link}
				label={link.label}
				active={pathname == link.link || (link.link != "/" && pathname.includes(link.link))}
				fw={pathname == link.link ? 500 : undefined}
				opened={pathname == link.link || pathname.includes(link.link)}
				leftSection={
					link.leftSection ? <link.leftSection size={iconSize} stroke={iconStrokeWidth} /> : undefined
				}
				rightSection={
					link.rightSection ? <link.rightSection size={iconSize} stroke={iconStrokeWidth} /> : undefined
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
				size={240}
				classNames={{
					body: classes.body,
					header: classes.header,
				}}
			>
				<Stack>
					<Stack gap={0}>{navMobile}</Stack>

					<Stack gap={"xs"} px={"xs"}>
						{!session && (
							<FragmentSignIn>
								<Button size="xs" variant="light">
									Log In
								</Button>
							</FragmentSignIn>
						)}

						<Button size="xs" w={"75%"}>
							Get in Touch
						</Button>
					</Stack>
				</Stack>
			</Drawer>

			<Burger opened={opened} onClick={toggle} size={"sm"} aria-label="Toggle Main Navbar" color="pri" />
		</>
	);
}
