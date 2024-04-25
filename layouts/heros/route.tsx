import React from "react";

import { usePathname } from "next/navigation";

import { Box, Container, Group, Title } from "@mantine/core";

import Component from "@/components";
import utility from "@/utilities";

export default function Route() {
	const pathname = usePathname();
	const segments = utility.parser.string.crumbify(pathname);

	return (
		<Box
			component="section"
			style={theme => ({
				backgroundColor: theme.colors.sec[0],
				padding: `${theme.spacing.lg} 0`,
			})}
		>
			<Container>
				<Group align="center" justify="space-between">
					<Component.Breadcrumb.Hero data={segments} />
					<Title order={1} fw={500} fz={24}>
						{segments[segments.length - 1].label}
					</Title>
				</Group>
			</Container>
		</Box>
	);
}
