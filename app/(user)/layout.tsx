import React from "react";

import LayoutBody from "@/components/layout/body";
import NavbarMain from "@/components/layout/navbars/main";
import FooterMain from "@/components/layout/footers/main";
import HeaderMain from "@/components/layout/headers/main";
import AsideUser from "@/components/layout/asides/user";
import LayoutSection from "@/components/layout/section";
import NavbarUser from "@/components/layout/navbars/user";

import AffixTop from "@/components/common/affixi/top";

import appData from "@/data/app";

import { Metadata } from "next";

import { Box, Divider, Stack } from "@mantine/core";

export const metadata: Metadata = {
	title: {
		default: "User",
		template: `%s - User - ${appData.name.app}`
	}
};

export default function LayoutUser({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody
			header={<HeaderMain />}
			nav={<NavbarMain />}
			aside={{
				gap: 48,
				left: {
					component: <AsideUser />,
					width: { md: 30, lg: 22.5 },
					withBorder: true
				}
			}}
			footer={<FooterMain />}
		>
			<LayoutSection id={"layout-user"} component={"main"} padded>
				<Stack gap={48}>
					<Box hiddenFrom="md">
						<NavbarUser />
					</Box>

					<Divider hiddenFrom="md" />

					{children}
				</Stack>
			</LayoutSection>

			<AffixTop />
		</LayoutBody>
	);
}
