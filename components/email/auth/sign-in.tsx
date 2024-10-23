import * as React from "react";

import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text } from "@react-email/components";

import appData from "@/data/app";

import LayoutEmail from "@/components/layout/email";

export default function SignIn(otp: string) {
	const message = `sign in`;

	return (
		<LayoutEmail props={{ message }}>
			<Container style={content}>
				<Section style={header}>
					<Container style={container}>
						<Heading style={{ ...h1, textAlign: "center" }}>{appData.name.company}</Heading>
						{/* <Img
							src={"https://localhost:300/path/to/image"}
							width={32}
							height={32}
							alt={appData.name.company}
						/> */}
					</Container>
				</Section>

				<Section style={main}>
					<Container style={container}>
						<Section style={section}>
							<Heading style={h2}>Verify Your Email Address</Heading>
							<Text style={text}>{message}</Text>
						</Section>

						<Section style={{ ...section, margin: "40px 0px" }}>
							<Text style={{ ...text, textAlign: "center", fontWeight: "bold", fontSize: 32 }}>
								{otp}
							</Text>
							<Text style={{ ...text, textAlign: "center", marginTop: "8px" }}>
								(this code is valid for 1 hour)
							</Text>
						</Section>

						<Section style={section}>
							<Text style={text}>
								{appData.name.app} will never email you and ask you to disclose or verify your password,
								credit card, banking account number or any other sensitive personal information.
							</Text>
						</Section>
					</Container>
				</Section>

				<Section style={footer}>
					<Container style={container}>
						<Text style={{ ...text, textAlign: "center" }}>
							Copyright © {new Date().getFullYear()}, {appData.name.company}. All rights reserved.
						</Text>
						<Text style={{ ...text, textAlign: "center" }}>
							This message was produced and distributed by {appData.name.company}, or its affiliates.
						</Text>
						<Text style={{ ...text, textAlign: "center" }}>{appData.emails.info}.</Text>
					</Container>
				</Section>
			</Container>
		</LayoutEmail>
	);
}

const content = {
	maxWidth: "640px",
	margin: "0 auto",
	overflow: "hidden"
};

const headerFooter = {
	backgroundColor: "#e4e6ed",
	padding: "20px 0"
};

const header = {
	...headerFooter,
	display: "flex",
	alignItems: "center",
	justifyContent: "center"
};

const footer = {
	...headerFooter
};

const main = {
	// backgroundColor: "gray",
};

const section = {
	margin: "20px 0"
};

const container = {
	minWidth: "100%",
	padding: "0 20px"
};

const h1 = {
	fontSize: "24px",
	fontWeight: "bolder"
};

const h2 = {
	fontSize: "20px",
	fontWeight: "bold"
};

const text = {
	margin: 0,
	fontSize: "12px"
};

const link = {
	margin: 0,
	fontWeight: "bold",
	color: "red"
};
