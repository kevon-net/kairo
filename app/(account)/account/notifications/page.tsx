import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications" };

export default async function Notifications() {
	const session = await auth();

	!session?.user && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection containerized={"responsive"}>Notifications page</LayoutSection>
		</LayoutPage>
	);
}
