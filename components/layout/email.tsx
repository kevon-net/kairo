import * as React from "react";

import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components";
import appData from "@/data/app";

export default function Email({ props, children }: { props: { message: string }; children: React.ReactNode }) {
	return (
		<Html lang="en">
			<Head />

			<Preview>{props.message}</Preview>

			<Body>
				{children}

				<Section>
					<Container>
						<Text style={{ textAlign: "center" }}>
							Copyright © {new Date().getFullYear()}, {appData.name.company}. All rights reserved.
						</Text>
						<Text style={{ textAlign: "center" }}>
							This message was produced and distributed by {appData.name.company}, or its affiliates.
						</Text>
						<Text style={{ textAlign: "center" }}>{appData.emails.info}.</Text>
					</Container>
				</Section>
			</Body>
		</Html>
	);
}
