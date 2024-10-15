import React from "react";

import { Anchor, Group, ThemeIcon } from "@mantine/core";

import LayoutSection from "@/components/layouts/section";

import classes from "./main.module.scss";
import { dataContact, dataSocials } from "@/app/(marketing)/contact/page";

export default function Main() {
	return (
		<LayoutSection containerized="responsive" shadowed padded="sm" className={classes.header} visibleFrom="xs">
			<Group justify="space-between">
				<Group gap={"lg"}>
					{dataContact.map(item => (
						<Group key={item.link} gap={6} c={"pri.0"}>
							<item.icon size={20} stroke={1.5} style={{ marginTop: 2 }} />
							<Anchor
								href={item.link}
								underline="hover"
								inherit
								fz={{ base: "xs", lg: "sm" }}
								className={classes.link}
							>
								{item.label}
							</Anchor>
						</Group>
					))}
				</Group>

				<Group>
					{dataSocials.map(social => (
						<Anchor key={social.link} title={social.label} href={social.link}>
							<Group>
								<ThemeIcon size={24} color="white" className={classes.icon}>
									<social.icon size={16} stroke={2} />
								</ThemeIcon>
							</Group>
						</Anchor>
					))}
				</Group>
			</Group>
		</LayoutSection>
	);
}
