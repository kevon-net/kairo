import React from "react";

import Layout from "@/layouts";
import Partial from "@/partials";

export default function Contact() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized>Contact page</Layout.Section>
			<Layout.Section containerized={"xs"}>
				<Partial.Form.Contact />
			</Layout.Section>
		</Layout.Page>
	);
}
