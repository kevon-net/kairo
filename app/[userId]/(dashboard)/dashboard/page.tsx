import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Dashboard",
};

export default async function Dashboard() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized>Dashboard page</Layout.Section>
		</Layout.Page>
	);
}
