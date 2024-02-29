import React from "react";

type typeBody = {
	header?: React.ReactNode;
	nav?: React.ReactNode;
	hero?: React.ReactNode;
	children: React.ReactNode;
	aside?: {
		left?: React.ReactNode;
		right?: React.ReactNode;
	};
	footer?: React.ReactNode;
};

export default typeBody;
