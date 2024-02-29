import React from "react";

import { usePathname } from "next/navigation";

import { Box, Container, Group, Title } from "@mantine/core";

import Breadcrumbs from "@/components/breadcrumbs";
import hook from "@/hooks";

export default function Route() {
	const location = usePathname();
	const crumbs = hook.useCrumbify(location);

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
					<Breadcrumbs.Hero data={crumbs} />
					<Title order={1} fw={500} fz={24}>
						{crumbs[crumbs.length - 1].label}
					</Title>
				</Group>
			</Container>
		</Box>
	);
}
