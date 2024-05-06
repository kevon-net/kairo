import React from "react";

export interface typeWidth {
	md?: number;
	lg?: number;
}

export interface typeBody {
	header?: React.ReactNode;
	nav?: React.ReactNode;
	hero?: React.ReactNode;
	children: React.ReactNode;
	aside?: {
		gap?: string | number;
		left?: {
			component: React.ReactNode;
			width?: typeWidth;
			withBorder?: boolean;
		};
		right?: {
			component: React.ReactNode;
			width?: typeWidth;
			withBorder?: boolean;
		};
	};
	footer?: React.ReactNode;
}
