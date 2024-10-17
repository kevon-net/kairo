import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import { Group, Box, Image, Button, Divider } from "@mantine/core";

import LayoutSection from "@/components/layouts/section";
import DrawerNavMain from "@/components/drawers/nav/main";
import NavigationMain from "@/components/navigation/main";
import MenuAvatar from "@/components/menus/avatar";
import ActionIconTheme from "@/components/action-icons/theme";

import AuthSignIn from "@/components/auth/signIn";

import sample from "@/data/sample";
import images from "@/assets/images";

import appData from "@/data/app";

import { auth } from "@/auth";

export default async function Main() {
	const session = await auth();

	return (
		<LayoutSection id={"partial-navbar-main"} containerized="responsive" shadowed padded="lg">
			<Group justify="space-between">
				<Group align="end" gap={"lg"}>
					<Box>
						<Link href={"/"}>
							<Group>
								<Image
									src={images.brand.logo.light}
									alt={appData.name.app}
									h={{ base: 24 }}
									component={NextImage}
									width={1920}
									height={1080}
									priority
								/>
							</Group>
						</Link>
					</Box>

					<Divider orientation="vertical" visibleFrom="sm" />

					<Group component={"nav"} visibleFrom="sm">
						<NavigationMain />
					</Group>
				</Group>

				<Group visibleFrom="sm" gap={"xs"}>
					{!session?.user ? (
						<AuthSignIn>
							<Button size="xs" variant="light">
								Log In
							</Button>
						</AuthSignIn>
					) : (
						<MenuAvatar />
					)}

					<Button size="xs">Get in Touch</Button>

					<ActionIconTheme />
				</Group>

				<DrawerNavMain data={sample.links.navbar} hiddenFrom="sm" aria-label="Toggle Navigation" color="pri" />
			</Group>
		</LayoutSection>
	);
}
