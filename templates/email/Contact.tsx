import React from "react";

import { typeContact } from "@/types/form";

export default function Contact({ formValues }: { formValues: typeContact }) {
	return (
		<>
			<p>
				Name: {formValues.fname} {formValues.lname}
			</p>
			<p>Email: {formValues.email} </p>
			{formValues.phone && <p>Phone: {formValues.phone} </p>}
			<p>Message: {formValues.message}</p>
		</>
	);
}
