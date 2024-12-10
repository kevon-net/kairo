import React from 'react';

import { Metadata } from 'next';

import LayoutBody from '@/components/layout/body';

import { typeParams } from '../../layout';
import { TagGet } from '@/types/models/tag';
import { tagsGet } from '@/handlers/requests/database/tag';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const { tags }: { tags: TagGet[] } = await tagsGet();

  return {
    title: tags.find((t) => t.id == params.tagId)?.title,
  };
};

export default function LayoutTag({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
