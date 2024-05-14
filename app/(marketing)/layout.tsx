import React from "react";

import LayoutBody from "@/layouts/Body";
import NavbarMain from "@/partials/navbars/Main";
import FooterMain from "@/partials/footer/Main";

export default function Marketing({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody nav={<NavbarMain />} footer={<FooterMain />}>
			<main>{children}</main>
		</LayoutBody>
	);
}
