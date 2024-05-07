import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "Payment",
};

export default async function Payment() {
	return (
		<Layout.Page>
			<Layout.Section>Payment details page</Layout.Section>
		</Layout.Page>
	);
}
