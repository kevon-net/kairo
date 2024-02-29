import React from "react";

import { typeLinkMenu } from "../link/menu";

export interface typeMenuNavbar {
	children: React.ReactNode;
	subLinks?: typeLinkMenu[];
}
