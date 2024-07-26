import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/layouts/Body";

import contact from "@/data/contact";

export const metadata: Metadata = { title: { default: "Dashboard", template: `%s - Dashboard - ${contact.name.app}` } };

export default function Dashboard({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody>
			<main>{children}</main>
		</LayoutBody>
	);
}
