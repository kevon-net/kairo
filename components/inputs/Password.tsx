import React from "react";

import { PasswordInput } from "@mantine/core";

import classes from "./Password.module.scss";

export default function InputPassword({ ...restProps }: {} & React.ComponentProps<typeof PasswordInput>) {
	return (
		<PasswordInput
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
