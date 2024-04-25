import React from "react";

import Link from "next/link";

import Layout from "@/layouts";

export default function Blog() {
	return (
		<Layout.Page padded>
			<Layout.Section containerized>
				<p>Blog page</p>
				<ul>
					<li>
						<Link href="blog/1">blog1</Link>
					</li>
				</ul>
			</Layout.Section>
		</Layout.Page>
	);
}
