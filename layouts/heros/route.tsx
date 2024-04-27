"use client";

import React from "react";

import { usePathname } from "next/navigation";

import { Box, Container, Group, Title } from "@mantine/core";

import Breadcrumb from "@/components/breadcrumbs";
import handler from "@/handlers";

import classes from "./Route.module.scss";

export default function Route({ title }: { title?: string }) {
	const pathname = usePathname();
	const segments = handler.parser.string.crumbify(pathname);

	return (
		<Box component="section" className={classes.hero}>
			<Container size="responsive">
				<Group align="center" justify="space-between">
					<Breadcrumb.Hero data={segments} />
					<Title order={1} fw={500} fz={24}>
						{title ? title : segments[segments.length - 1].label}
					</Title>
				</Group>
			</Container>
		</Box>
	);
}
