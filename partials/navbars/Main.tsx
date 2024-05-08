import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import { Group, Box, Container, Image, ButtonGroup, Button, Skeleton } from "@mantine/core";

import asset from "@/assets";
import data from "@/data";
import Component from "@/components";
import Layout from "@/layouts";

import { SignedIn, SignedOut, SignInButton, SignUpButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";

import classes from "./Main.module.scss";

export default async function Main() {
	return (
		<Layout.Section withClerk className={classes.navbar}>
			<Container size={"responsive"}>
				<Group justify="space-between">
					<Group>
						<Box visibleFrom="sm">
							<Link href={"/"}>
								<Group>
									<Image
										src={asset.icon.tool.nextjs}
										alt="next icon"
										className={classes.logo}
										component={NextImage}
										priority
									/>
								</Group>
							</Link>
						</Box>
						<Component.Drawer.Nav.Main
							data={data.links.navbar}
							hiddenFrom="sm"
							aria-label="Toggle Navigation"
						/>

						<Group gap={"xs"} component={"nav"} visibleFrom="sm">
							<Component.Navigation.Main />
						</Group>
					</Group>

					<SignedOut>
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
								<Component.Drawer.Cart />
							</ClerkLoaded>

							<ClerkLoading>
								<Skeleton height={28} circle />
							</ClerkLoading>
							<ClerkLoaded>
								<Component.Clerk.UserButton />
								{/* <Component.Menu.Avatar /> */}
							</ClerkLoaded>
						</Group>
					</SignedIn>
				</Group>
			</Container>
		</Layout.Section>
	);
}
