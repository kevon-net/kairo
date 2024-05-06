import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "Addresses",
};

export default async function Addresses() {
	return (
		<Layout.Page>
			<Layout.Section>Shipping addresses page</Layout.Section>
		</Layout.Page>
	);
}
