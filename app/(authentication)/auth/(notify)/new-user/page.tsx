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

export const metadata: Metadata = { title: "Welcome" };

export default async function Welcome() {
	const session = await auth();

	session?.user && redirect("/");

	return <LayoutPage>welcome</LayoutPage>;
}
