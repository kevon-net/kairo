import React from "react";

import { Select } from "@mantine/core";

import classes from "./Select.module.scss";

export default function InputSelect({ ...restProps }: {} & React.ComponentProps<typeof Select>) {
	return (
		<Select
			classNames={{
				input: classes.input,
				label: classes.label,
				description: classes.description,
				error: classes.error,
				dropdown: classes.dropdown,
				option: classes.option,
			}}
			{...restProps}
		/>
	);
}
