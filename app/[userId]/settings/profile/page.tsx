import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "Profile",
};

export default async function Profile() {
	return (
		<Layout.Page>
			<Layout.Section containerized={"responsive"}>Profile page</Layout.Section>
		</Layout.Page>
	);
}
