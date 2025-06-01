import React from 'react';
import LayoutBody from '@/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { extractUuidFromParam } from '@/utilities/helpers/string';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<typeParams>;
}): Promise<Metadata> => {
  const postId = extractUuidFromParam((await params)['postTitle-postId']);
  const { posts }: { posts: any[] } = { posts: [] };
  const post = posts.find((p) => p.id == postId);

  return {
    title: post?.title,
    description: post?.excerpt,
    category: post?.category?.title,
  };
};

export default function LayoutPost({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
