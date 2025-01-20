import { categoriesGet } from '@/handlers/requests/database/category';
import { postsGet } from '@/handlers/requests/database/post';
import { tagsGet } from '@/handlers/requests/database/tag';
import { CategoryRelations } from '@/types/models/category';
import { PostRelations } from '@/types/models/post';
import { TagRelations } from '@/types/models/tag';
import { linkify } from '@/utilities/formatters/string';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://example.com';

  const staticRoutes = [
    '', // homepage
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const { posts }: { posts: PostRelations[] } = await postsGet();

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${linkify(post.title)}-${post.id}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const { categories }: { categories: CategoryRelations[] } =
    await categoriesGet();

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/blog/categories/${category.id}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const { tags }: { tags: TagRelations[] } = await tagsGet();

  const tagRoutes = tags.map((tag) => ({
    url: `${baseUrl}/blog/tags/${tag.id}`,
    lastModified: tag.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const dynamicRoutes = [...postRoutes, ...categoryRoutes, ...tagRoutes];

  return [...staticRoutes, ...dynamicRoutes];
}
