import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export const metadata: Metadata = {
	title: "Addresses",
};

export default async function Addresses() {
	return (
		<LayoutPage>
			<LayoutSection>Shipping addresses page</LayoutSection>
		</LayoutPage>
	);
}
