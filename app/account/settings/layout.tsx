import React from "react";

import { Metadata } from "next";

import { Divider, Stack } from "@mantine/core";

import LayoutBody from "@/layouts/Body";
import LayoutSection from "@/layouts/Section";
import NavbarMain from "@/partials/navbars/Main";
import NavbarUser from "@/partials/navbars/User";
import AsideUser from "@/partials/asides/User";
import FooterMain from "@/partials/footers/Main";

export const metadata: Metadata = { title: "Settings" };

export default function Profile({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody
			nav={<NavbarMain />}
			footer={<FooterMain />}
			aside={{
				gap: 48,
				left: {
					component: <AsideUser />,
					width: { md: 30, lg: 22.5 },
					withBorder: true,
				},
			}}
		>
			<LayoutSection component={"main"} padded>
				<Stack gap={48}>
					<LayoutSection hiddenFrom="md">
						<NavbarUser />
					</LayoutSection>

					<Divider hiddenFrom="md" />

					{children}
				</Stack>
			</LayoutSection>
		</LayoutBody>
	);
}
