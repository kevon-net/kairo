import React from "react";

import { Container } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";

export default function Contact() {
	return (
		<Layout.Body>
			<Container size={"xs"} py={"xl"}>
				<Partial.Form.Contact />
			</Container>
		</Layout.Body>
	);
}
