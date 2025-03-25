import React from 'react';
import LayoutBody from '@/components/layout/body';
import { typeParams } from '../layout';
// import { Metadata } from 'next';
// import { extractUuidFromParam } from '@/utilities/helpers/string';

// export const generateMetadata = async ({
//   params,
// }: {
//   params: typeParams;
// }): Promise<Metadata> => {
//   const postId = extractUuidFromParam(params['postTitle-postId']);

//   const { posts }: { posts: PostRelations[] } = await postsGet();

//   const post = posts.find((p) => p.id == postId);

//   return {
//     title: post?.title,
//     description: post?.excerpt,
//     category: post?.category?.title,
//   };
// };

export default function LayoutPost({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
