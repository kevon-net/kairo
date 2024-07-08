import React from "react";

import NextImage from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Anchor, Center, Grid, GridCol, Group, Image, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import FormAuthSignIn from "@/partials/forms/auth/SignIn";

import brand from "@/assets/images/brand";
import contact from "@/data/contact";

import { auth } from "@/auth";

import { signOut as authSignOut } from "@/auth";

export const metadata: Metadata = { title: "Signed Out" };

export default async function SignOut() {
	const session = await auth();

	return <LayoutPage>Signed Out</LayoutPage>;
}
