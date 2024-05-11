import React from "react";

import { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";

export interface typeParams {
	params: { userId: string };
}

export const generateMetadata = ({ params }: typeParams): Metadata => {
	return { title: { default: params.userId, template: `%s - ${params.userId} - Next Template` } };
};

export default function User({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<React.Fragment>
			<ClerkProvider>{children}</ClerkProvider>
		</React.Fragment>
	);
}
