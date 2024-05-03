import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "Account",
};

export default async function Account() {
	return (
		<Layout.Page>
			<Layout.Section containerized={"responsive"}>Account page</Layout.Section>
		</Layout.Page>
	);
}
