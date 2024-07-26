import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export const metadata: Metadata = { title: "Overview" };

export default async function Overview() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized={"responsive"}>
				Overview page
			</LayoutSection>
		</LayoutPage>
	);
}
