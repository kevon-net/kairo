import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/components/layouts/page";
import LayoutSection from "@/components/layouts/section";

export const metadata: Metadata = { title: "About" };

export default async function About() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized={"responsive"}>
				About page
			</LayoutSection>
		</LayoutPage>
	);
}
