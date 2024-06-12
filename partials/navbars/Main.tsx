import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import { Group, Box, Container, Image, ButtonGroup, Button, Skeleton } from "@mantine/core";

import LayoutSection from "@/layouts/Section";
import DrawerNavMain from "@/components/drawers/nav/Main";
import NavigationMain from "@/components/navigation/Main";
import DrawerCart from "@/components/drawers/Cart";

import links from "@/data/links";
import { nextjs } from "@/assets/icons/tool";

import classes from "./Main.module.scss";

export default async function Main() {
	return (
		<LayoutSection className={classes.navbar}>
			<Container size={"responsive"}>
				<Group justify="space-between">
					<Group>
						<Box visibleFrom="sm">
							<Link href={"/"}>
								<Group>
									<Image
										src={nextjs}
										alt="next icon"
										className={classes.logo}
										component={NextImage}
										priority
									/>
								</Group>
							</Link>
						</Box>
						<DrawerNavMain data={links.navbar} hiddenFrom="sm" aria-label="Toggle Navigation" />

						<Group gap={"xs"} component={"nav"} visibleFrom="sm">
							<NavigationMain />
						</Group>
					</Group>

					{/* <SignedOut>
						<ButtonGroup>
							<SignUpButton>
								<Button size="xs">Sign Up</Button>
							</SignUpButton>
							<SignInButton>
								<Button size="xs" variant="light">
									Sign In
								</Button>
							</SignInButton>
						</ButtonGroup>
					</SignedOut>

					<SignedIn>
						<Group>
							<ClerkLoading>
								<Skeleton height={24} circle />
							</ClerkLoading>
							<ClerkLoaded>
								<DrawerCart />
							</ClerkLoaded>

							<ClerkLoading>
								<Skeleton height={28} circle />
							</ClerkLoading>
							<ClerkLoaded>
								<ClerkUserButton />
								<Component.Menu.Avatar />
							</ClerkLoaded>
						</Group>
					</SignedIn> */}
				</Group>
			</Container>
		</LayoutSection>
	);
}
