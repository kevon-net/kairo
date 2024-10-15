import React from "react";

import LayoutBody from "@/components/layouts/body";
import NavbarMain from "@/components/partials/navbars/main";
import FooterMain from "@/components/partials/footers/main";
import HeaderMain from "@/components/partials/headers/main";

import AffixTop from "@/components/affixi/top";

export default function LayoutMarketing({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody header={<HeaderMain />} nav={<NavbarMain />} footer={<FooterMain />}>
			<main>{children}</main>

			<AffixTop />
		</LayoutBody>
	);
}
