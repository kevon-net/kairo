import React from "react";

import { Metadata } from "next";

import { Anchor, Card, Flex, Grid, GridCol, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";

import {
	IconBrandFacebook,
	IconBrandInstagram,
	IconBrandLinkedin,
	IconBrandX,
	IconMail,
	IconPhone,
} from "@tabler/icons-react";

import LayoutPage from "@/components/layouts/page";
import LayoutSection from "@/components/layouts/section";
import FormContact from "@/components/partials/forms/contact";
import AccordionFaq from "@/components/accordions/faq";

import TemplateEmailContact from "@/components/templates/email/contact";

import appData from "@/data/app";

export const metadata: Metadata = { title: "Contact" };

export default async function Contact() {
	return (
		<LayoutPage>
			{/* <TemplateEmailContact /> */}

			{/* <LayoutSection padded containerized={"responsive"}>Contact page</LayoutSection> */}

			<LayoutSection id={"page-contact"} padded containerized={"responsive"}>
				<Stack gap={64}>
					<Stack>
						<Title order={2} fz={48} fw={"bold"} ta={"center"} lh={1}>
							Let Us Know <br />
							What You Think!
						</Title>
						<Text ta={"center"}>
							Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit
							aliquam sit nullam.
						</Text>
					</Stack>

					<Grid gutter={{ base: "xl", lg: 64 }}>
						<GridCol span={{ base: 12, sm: 6 }} order={{ base: 2, sm: 1 }}>
							<Card withBorder shadow="xs" padding={"md"} bg={"transparent"}>
								<FormContact />
							</Card>
						</GridCol>
						<GridCol span={{ base: 12, sm: 6 }} order={{ base: 1, sm: 2 }}>
							<Stack gap={"xl"}>
								<Stack gap={"xs"}>
									<Title order={3} fz={24} fw={"bold"} ta={{ base: "center", sm: "start" }} lh={1}>
										Want to reach out directly?
									</Title>
									<Text ta={{ base: "center", sm: "start" }}>
										Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus
										mollis sit aliquam sit nullam.
									</Text>
								</Stack>

								<Flex
									align={"center"}
									direction={{ base: "column", sm: "row" }}
									gap={{ base: "md", md: "xl" }}
								>
									{dataContact.map(item => (
										<Group key={item.link} w={{ base: "66%", xs: "fit-content" }}>
											<ThemeIcon size={40} variant="transparent">
												<item.icon size={24} stroke={1.5} style={{ marginTop: 2 }} />
											</ThemeIcon>

											<Stack gap={0}>
												<Text component="span" inherit fz={{ base: "xs", lg: "sm" }}>
													Contact:
												</Text>
												<Anchor href={item.link} inherit fz={{ base: "xs", lg: "sm" }} fw={500}>
													{item.label}
												</Anchor>
											</Stack>
										</Group>
									))}
								</Flex>

								<Flex align={{ base: "center", sm: "start" }} direction={"column"} gap={"xs"}>
									<Text ta={{ base: "center", sm: "start" }}>Follow us on social media:</Text>

									<Group>
										{dataSocials.map(social => (
											<Anchor key={social.link} title={social.label} href={social.link}>
												<Group>
													<ThemeIcon size={24}>
														<social.icon size={16} stroke={2} />
													</ThemeIcon>
												</Group>
											</Anchor>
										))}
									</Group>
								</Flex>

								<AccordionFaq />
							</Stack>
						</GridCol>
					</Grid>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}

const email = appData.emails.info;
const phone = appData.phones.main;
const facebook = appData.socials.facebook;
const twitter = appData.socials.twitter;
const instagram = appData.socials.instagram;
const linkedin = appData.socials.linkedin;

export const dataContact = [
	{
		icon: IconMail,
		link: `mailto:${email}`,
		label: email,
	},
	{
		icon: IconPhone,
		link: `tel:${phone}`,
		label: phone,
	},
];

export const dataSocials = [
	{
		icon: IconBrandFacebook,
		link: facebook.link,
		label: facebook.platform,
	},
	{
		icon: IconBrandX,
		link: twitter.link,
		label: twitter.platform,
	},
	{
		icon: IconBrandInstagram,
		link: instagram.link,
		label: instagram.platform,
	},
	{
		icon: IconBrandLinkedin,
		link: linkedin.link,
		label: linkedin.platform,
	},
];
