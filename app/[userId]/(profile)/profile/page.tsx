import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "Profile",
};

export default function Profile() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized>Profile page</Layout.Section>
		</Layout.Page>
	);
}
