import React from "react";

import LayoutBody from "@/components/layout/body";
import NavbarMain from "@/components/layout/navbars/main";
import FooterMain from "@/components/layout/footers/main";
import HeaderMain from "@/components/layout/headers/main";

import AffixTop from "@/components/common/affixi/top";
import { Metadata } from "next";
import appData from "@/data/app";

export const metadata: Metadata = {
	title: {
		default: "Dashboard",
		template: `%s - Dashboard - ${appData.name.app}`
	}
};

export default function LayoutDashboard({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody
			header={<HeaderMain />}
			nav={<NavbarMain />}
			footer={<FooterMain />}
		>
			<main>{children}</main>

			<AffixTop />
		</LayoutBody>
	);
}
