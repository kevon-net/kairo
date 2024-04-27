import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import { Group, Box, Container, Image } from "@mantine/core";

import asset from "@/assets";
import data from "@/data";
import Component from "@/components";

import classes from "./Main.module.scss";

export default function Main() {
	return (
		<Box className={classes.navbar}>
			<Container size={"responsive"}>
				<Group justify="space-between">
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

					<Group gap={"xs"} component={"nav"} visibleFrom="sm">
						<Component.Navigation.Main />
					</Group>

					<Component.Drawer.Nav.Main
						data={data.links.navbar}
						hiddenFrom="sm"
						aria-label="Toggle Navigation"
					/>
				</Group>
			</Container>
		</Box>
	);
}
