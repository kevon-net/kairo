import * as React from "react";

import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text } from "@react-email/components";

import constants from "./constants";

import { typeContact } from "@/types/form";

export default function Contact(data: typeContact) {
	return (
		<Html lang="en">
			<Head />

			<Preview>{data.message}</Preview>

			<Body>
				<Container style={content}>
					<Section style={header}>
						<Container style={container}>
							<Heading style={{ ...h1, textAlign: "center" }}>{constants.brand.name}</Heading>
							{/* <Img
							src={"https://localhost:300/path/to/image"}
							width={32}
							height={32}
							alt={constants.brand.name}
						/> */}
						</Container>
					</Section>

					<Section style={main}>
						<Container style={container}>
							<Section style={section}>
								{/* <Heading style={h2}>{constants.brand.name}</Heading> */}
								<Text style={text}>
									Recipient, <br />
									{data.message} <br />
									<br />
									Regards, <br />
									{data.fname} {data.lname}
								</Text>
							</Section>

							{/* <Section style={section}>
							<Heading style={h2}>Didn't request this?</Heading>
							<Text style={text}>
								If you did not make this change, please reach out to an administrator for support.
							</Text>
						</Section> */}
						</Container>
					</Section>

					<Section style={footer}>
						<Container style={container}>
							<Text style={{ ...text, textAlign: "center" }}>
								© {constants.year}, {constants.brand.name}. All rights reserved. Read our{" "}
								<Link href="#" style={link}>
									Privacy Notice
								</Link>
								.
							</Text>
							<Text style={{ ...text, textAlign: "center" }}>
								This message was produced and distributed by {constants.brand.name}, or its affiliates.
							</Text>
							<Text style={{ ...text, textAlign: "center" }}>
								{constants.addresses.find(a => a.place == "Main Office")?.label}.
							</Text>
						</Container>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

const sampleData = {
	fname: "Jane",
	lname: "Smith",
	email: "jane@example.com",
	phone: null,
	subject: "Test Subject",
	message: "This is some text.",
};

const content = {
	maxWidth: "640px",
	margin: "0 auto",
	overflow: "hidden",
};

const headerFooter = {
	backgroundColor: "orange",
	padding: "20px 0",
};

const header = {
	...headerFooter,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

const footer = {
	...headerFooter,
};

const main = {
	// backgroundColor: "gray",
};

const section = {
	margin: "20px 0",
};

const container = {
	minWidth: "100%",
	padding: "0 20px",
};

const h1 = {
	fontSize: "24px",
	fontWeight: "bolder",
};

const h2 = {
	fontSize: "20px",
	fontWeight: "bold",
};

const text = {
	margin: 0,
	fontSize: "12px",
};

const link = {
	margin: 0,
	fontWeight: "bold",
	color: "red",
};
