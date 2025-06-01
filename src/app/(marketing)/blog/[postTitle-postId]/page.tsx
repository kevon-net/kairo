import React from 'react';
import LayoutPage from '@/components/layout/page';
import { typeParams } from '../layout';
import { extractUuidFromParam } from '@/utilities/helpers/string';
import { redirect } from 'next/navigation';
import { linkify } from '@/utilities/formatters/string';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function generateStaticParams() {
  // const { data: posts, error } = await postsGet();
  const { data: posts }: { data: any } = { data: null };

  // if (error) throw error;
  if (posts == null) return [];

  return posts.map((p: any) => ({
    'postTitle-postId': `${linkify(p.title)}-${p.id}`,
  }));
}

export default async function Post({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const postId = extractUuidFromParam((await params)['postTitle-postId']);

  if (!postId) redirect('/not-found');

  return <LayoutPage>{JSON.stringify(postId)}</LayoutPage>;
}
