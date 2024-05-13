import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/layouts/Body";
// import NavbarMain from "@/partials/navbars/Main";
// import FooterMain from "@/partials/footer/Main";

import { currentUser } from "@clerk/nextjs/server";

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await currentUser();

	return {
		title: {
			default: "Dashboard",
			template: `%s - Dashboard - ${user ? user.fullName : "User"} - Next Template`,
		},
	};
};

export default function Marketing({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody
		// nav={<NavbarMain />}
		// footer={<FooterMain />}
		>
			<main>{children}</main>
		</LayoutBody>
	);
}
