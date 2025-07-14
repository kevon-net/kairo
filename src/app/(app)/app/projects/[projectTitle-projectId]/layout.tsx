import React from 'react';
import LayoutBody from '@/components/layout/body';
import { Metadata } from 'next';
import { extractSlugFromParam } from '@/utilities/helpers/string';
import { typeParams } from '../layout';
import { capitalizeWords } from '@/utilities/formatters/string';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<typeParams>;
}): Promise<Metadata> => {
  const projectTitle = extractSlugFromParam(
    (await params)['projectTitle-projectId']
  );

  return {
    title: projectTitle ? capitalizeWords(projectTitle) : 'Project',
  };
};

export default function LayoutPost({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
