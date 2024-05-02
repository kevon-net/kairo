import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";
import Partial from "@/partials";

export const metadata: Metadata = {
	title: "Contact",
};

export default function Contact() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized={"responsive"}>Contact page</Layout.Section>
			{/* <Layout.Section containerized={"xs"}>
				<Partial.Form.Contact />
			</Layout.Section> */}
		</Layout.Page>
	);
}
