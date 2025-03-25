import React from 'react';

import { Metadata } from 'next';

import LayoutBody from '@/components/layout/body';

import { typeParams } from '../../layout';
import { categoriesGet } from '@/handlers/requests/database/category';
import { CategoryGet } from '@/types/models/category';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const { categories }: { categories: CategoryGet[] } = await categoriesGet();

  return {
    title: categories.find((p) => p.id == params.categoryId)?.title,
  };
};

export default function LayoutCategory({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
