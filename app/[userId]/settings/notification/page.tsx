import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "Notification",
};

export default async function Notification() {
	return (
		<Layout.Page>
			<Layout.Section containerized={"responsive"}>Notification page</Layout.Section>
		</Layout.Page>
	);
}
