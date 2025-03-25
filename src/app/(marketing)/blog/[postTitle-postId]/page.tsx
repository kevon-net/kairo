import React from 'react';
import LayoutPage from '@/components/layout/page';
import { typeParams } from '../layout';
import { extractUuidFromParam } from '@/utilities/helpers/string';
import { redirect } from 'next/navigation';

export default async function Post({ params }: { params: typeParams }) {
  const postId = extractUuidFromParam(params['postTitle-postId']);
  console.log('postId', postId);

  if (!postId) redirect('/not-found');

  return <LayoutPage>blog detail</LayoutPage>;
}
