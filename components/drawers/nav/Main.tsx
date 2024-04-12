import React from "react";

import { Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import asset from "@/assets";
import data from "@/data";

import Component from "@/components";

import classes from "./Main.module.scss";
import { usePathname } from "next/navigation";

export default function Main({ ...restProps }: {} & React.ComponentProps<typeof Burger>) {
	const [opened, { toggle, close }] = useDisclosure(false);
	const pathname = usePathname();

	const navMobile = data.links.navbar.map(link => {
		const subLinks =
			link.subLinks &&
			link.subLinks.map(subLink => (
				<Component.Core.NavLink.Navbar
					key={subLink.link}
					href={subLink.link}
					label={subLink.label}
					active={pathname == subLink.link}
					onClick={() => close()}
				/>
			));

		return !subLinks ? (
			<Component.Core.NavLink.Navbar
				key={link.link}
				href={link.link}
				label={link.label}
				active={pathname == link.link}
				onClick={() => close()}
				leftSection={link.iconLeft ? <link.iconLeft size={14} /> : undefined}
				rightSection={link.iconRight ? <link.iconRight size={14} /> : undefined}
			/>
		) : (
			<Component.Core.NavLink.Navbar
				key={link.link}
				href={link.link}
				label={link.label}
				active={pathname == link.link}
				opened={link.subLinks.find(sl => sl.link == pathname)?.link == pathname ? true : undefined}
				withChildren={true}
				leftSection={link.iconLeft ? <link.iconLeft size={14} /> : undefined}
				rightSection={link.iconRight ? <link.iconRight size={14} /> : undefined}
			>
				{subLinks}
			</Component.Core.NavLink.Navbar>
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
				title={<Component.Core.Media.Image src={asset.icon.tool.nextjs} alt="Logo" width={32} height={32} />}
			>
				{navMobile}
			</Drawer>

			<Burger opened={opened} onClick={toggle} {...restProps} />
		</>
	);
}
