import React from "react";

import LayoutBody from "@/components/layouts/body";
import NavbarMain from "@/components/partials/navbars/main";
import FooterMain from "@/components/partials/footers/main";
import HeaderMain from "@/components/partials/headers/main";
import AsideUser from "@/components/partials/asides/user";
import LayoutSection from "@/components/layouts/section";
import NavbarUser from "@/components/partials/navbars/user";

import AffixTop from "@/components/affixi/top";

import appData from "@/data/app";

import { Metadata } from "next";

import { Divider, Stack } from "@mantine/core";

export const metadata: Metadata = { title: { default: "Account", template: `%s - Account - ${appData.name.app}` } };

export default function LayoutAccount({
	children, // will be a page or nested layout
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
					withBorder: true,
				},
			}}
			footer={<FooterMain />}
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

			<AffixTop />
		</LayoutBody>
	);
}
