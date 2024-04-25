import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: "About",
};

export default function About() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized>About page</Layout.Section>
		</Layout.Page>
	);
}
