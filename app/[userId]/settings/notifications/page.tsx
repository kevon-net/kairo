import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export const metadata: Metadata = {
	title: "Notifications",
};

export default async function Notification() {
	return (
		<LayoutPage>
			<LayoutSection containerized={"responsive"}>Notifications page</LayoutSection>
		</LayoutPage>
	);
}
