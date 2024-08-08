import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Payment" };

export default async function Payment() {
	const session = await auth();

	!session?.user && redirect("/");

	return (
		<LayoutPage>
			<LayoutSection containerized={"responsive"}>Payment details page</LayoutSection>
		</LayoutPage>
	);
}
