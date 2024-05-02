import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "About",
};

export default async function About() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized={"responsive"}>About page</Layout.Section>
		</Layout.Page>
	);
}
