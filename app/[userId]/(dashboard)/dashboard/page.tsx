import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export const metadata: Metadata = {
	title: "Overview",
};

export default async function Dashboard() {
	return (
		<LayoutPage padded>
			<LayoutSection containerized>Dashboard page</LayoutSection>
		</LayoutPage>
	);
}
