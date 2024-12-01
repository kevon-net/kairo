import React from 'react';

import { Metadata } from 'next';

import LayoutBody from '@/components/layout/body';

import { typeParams } from '../../layout';
import { linkify } from '@/utilities/formatters/string';
import { TagRelations } from '@/types/models/tag';
import { tagsGet } from '@/handlers/requests/database/tag';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const { tags }: { tags: TagRelations[] } = await tagsGet();

  return {
    title:
      tags.find((t) => linkify(t.id || '') == params.tagId)?.title || 'Title',
  };
};

export default function LayoutTag({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
