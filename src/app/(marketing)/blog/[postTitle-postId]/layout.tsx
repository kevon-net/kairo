import React from 'react';

import { Metadata } from 'next';

import LayoutBody from '@/components/layout/body';
// import AsideBlog from '@/components/layout/asides/blog';

import { typeParams } from '../layout';
import { PostRelations } from '@/types/models/post';
import { postsGet } from '@/handlers/requests/database/post';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const { posts }: { posts: PostRelations[] } = await postsGet();

  const [postId] = params['postTitle-postId'].split('-');

  const post = posts.find((p) => p.id == postId);

  return {
    title: post?.title,
    description: post?.excerpt,
    category: post?.category?.title,
  };
};

export default function LayoutPost({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return (
    <LayoutBody
    // aside={{
    //   gap: 32,
    //   right: {
    //     component: <AsideBlog params={params} />,
    //     width: { md: 33, lg: 33 },
    //   },
    // }}
    >
      {children}
    </LayoutBody>
  );
}
