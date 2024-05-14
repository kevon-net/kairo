import React from "react";

import Link from "next/link";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export default function Blog() {
	return (
		<LayoutPage padded>
			<LayoutSection containerized={"responsive"}>
				<p>Blog page</p>
				<ul>
					<li>
						<Link href="blog/1">blog1</Link>
					</li>
				</ul>
			</LayoutSection>
		</LayoutPage>
	);
}
