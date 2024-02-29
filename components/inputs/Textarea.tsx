import React from "react";

import { Textarea } from "@mantine/core";

import classes from "./Textarea.module.scss";

export default function InputTextarea({ ...restProps }: {} & React.ComponentProps<typeof Textarea>) {
	return (
		<Textarea
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
