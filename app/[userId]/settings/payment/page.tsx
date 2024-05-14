import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export const metadata: Metadata = {
	title: "Payment",
};

export default async function Payment() {
	return (
		<LayoutPage>
			<LayoutSection>Payment details page</LayoutSection>
		</LayoutPage>
	);
}
