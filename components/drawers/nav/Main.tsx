import React from "react";

import { Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import asset from "@/assets";
import data from "@/data";

import Component from "@/components";

import classes from "./Main.module.scss";

export default function Main({ ...restProps }: {} & React.ComponentProps<typeof Burger>) {
	const [opened, { toggle, close }] = useDisclosure(false);

	const navMobile = data.links.navbar.map(link => {
		const subLinks =
			link.subLinks &&
			link.subLinks.map(subLink => (
				<Component.Navlink.Navbar
					key={subLink.link}
					href={subLink.link}
					label={subLink.label}
					onClick={() => close()}
				/>
			));

		return !subLinks ? (
			<Component.Navlink.Navbar
				key={link.link}
				href={link.link}
				label={link.label}
				onClick={() => close()}
				leftSection={link.iconLeft && <link.iconLeft size={14} />}
				rightSection={link.iconRight && <link.iconRight size={14} />}
			/>
		) : (
			<Component.Navlink.Navbar
				key={link.link}
				href={link.link}
				label={link.label}
				withChildren={true}
				leftSection={link.iconLeft && <link.iconLeft size={14} />}
				rightSection={link.iconRight && <link.iconRight size={14} />}
			>
				{subLinks}
			</Component.Navlink.Navbar>
		);
	});

	return (
		<>
			<Drawer
				opened={opened}
				onClose={close}
				withCloseButton={false}
				size={200}
				classNames={{
					body: classes.body,
					close: classes.close,
					content: classes.content,
					header: classes.header,
					inner: classes.inner,
					overlay: classes.overlay,
					root: classes.root,
					title: classes.title,
				}}
				title={<Component.Media.Image src={asset.icon.software.code} alt="vscode" width={32} height={32} />}
			>
				{navMobile}
			</Drawer>

			<Burger opened={opened} onClick={toggle} {...restProps} />
		</>
	);
}
