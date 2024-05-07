import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "Overview",
};

export default async function Dashboard() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized>Dashboard page</Layout.Section>
		</Layout.Page>
	);
}
