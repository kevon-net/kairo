import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "Notifications",
};

export default async function Notification() {
	return (
		<Layout.Page>
			<Layout.Section containerized={"responsive"}>Notifications page</Layout.Section>
		</Layout.Page>
	);
}
