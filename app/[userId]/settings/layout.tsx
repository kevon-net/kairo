import React from "react";

import { Metadata } from "next";

import { Divider, Stack } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";

import { currentUser } from "@clerk/nextjs/server";

export const generateMetadata = async (): Metadata => {
	const user = await currentUser();

	return {
		title: {
			default: "Settings",
			template: `%s - Settings - ${user ? user.fullName : "User"} - Next Template`,
		},
	};
};

export default function Profile({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<Layout.Body
			nav={<Partial.Navbar.Main />}
			footer={<Partial.Footer.Main />}
			aside={{
				gap: 48,
				left: {
					component: <Partial.Aside.User />,
					width: { md: 30, lg: 22.5 },
					withBorder: true,
				},
			}}
		>
			<Layout.Section component={"main"} padded>
				<Stack gap={48}>
					<Layout.Section hiddenFrom="md">
						<Partial.Navbar.User />
					</Layout.Section>

					<Divider hiddenFrom="md" />

					{children}
				</Stack>
			</Layout.Section>
		</Layout.Body>
	);
}
