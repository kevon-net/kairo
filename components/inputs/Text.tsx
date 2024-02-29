import React from "react";

import { TextInput } from "@mantine/core";

import classes from "./Text.module.scss";

export default function InputText({ ...restProps }: {} & React.ComponentProps<typeof TextInput>) {
	return (
		<TextInput
			classNames={{
				input: classes.input,
				label: classes.label,
				description: classes.description,
				error: classes.error,
			}}
			{...restProps}
		/>
	);
}
