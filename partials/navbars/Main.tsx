import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import { Group, Box, Container, Image } from "@mantine/core";

import asset from "@/assets";
import data from "@/data";
import Component from "@/components";

import classes from "./Main.module.scss";

import Partial from "..";

import { auth } from "@/auth";

export default async function Main() {
	const session = await auth();

	return (
		<Box className={classes.navbar}>
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

					{session?.user ? (
						<Group>
							<Component.Drawer.Cart />
							<Component.Menu.Avatar />
						</Group>
					) : (
						<Box visibleFrom="sm">
							<Partial.Buttons.Auth />
						</Box>
					)}
				</Group>
			</Container>
		</Box>
	);
}
