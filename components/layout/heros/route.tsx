"use client";

import React from "react";

import LayoutSection from "../section";

import { usePathname } from "next/navigation";

import { Stack, Title } from "@mantine/core";

import BreadcrumbMain from "@/components/common/breadcrumbs/main";

import classes from "./home.module.scss";

import { crumbify } from "@/utilities/formatters/string";

export default function Route({ props }: { props: { title?: string } }) {
	const pathname = usePathname();
	const segments = crumbify(pathname);

	return (
		<LayoutSection id={"layout-hero-route"} className={classes.hero}>
			<Stack align="center" justify="space-between">
				<BreadcrumbMain props={segments} />

				<Title order={1} fw={500} fz={24}>
					{props.title ? props.title : segments[segments.length - 1].label}
				</Title>
			</Stack>
		</LayoutSection>
	);
}
