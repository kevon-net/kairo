import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormContact from "@/partials/forms/Contact";

import TemplateEmailContact from "@/templates/email/Contact";

export const metadata: Metadata = { title: "Contact" };

export default async function Contact() {
	return (
		<LayoutPage>
			{/* <TemplateEmailContact /> */}

			{/* <LayoutSection padded containerized={"responsive"}>Contact page</LayoutSection> */}

			<LayoutSection padded containerized={"xs"}>
				<FormContact />
			</LayoutSection>
		</LayoutPage>
	);
}
