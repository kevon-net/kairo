import { Request as EnumRequest } from '@repo/enums';
import { apiUrl, headers } from '@/data/constants';
import { PostCreate, PostUpdate } from '@repo/types/models';
import { authHeaders } from '@/libraries/auth';

const baseRequestUrl = `${apiUrl}/posts`;

export const postsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: EnumRequest.GET,
      credentials: 'include',
      headers: await authHeaders(headers.withoutBody),
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get posts):', error);
    throw error;
  }
};

export const postGet = async (slug: { postId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${slug.postId}`, {
      method: EnumRequest.GET,
      credentials: 'include',
      headers: await authHeaders(headers.withoutBody),
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get post):', error);
    throw error;
  }
};

export const postCreate = async (post: PostCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: EnumRequest.POST,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
      body: JSON.stringify(post),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create post):', error);
    throw error;
  }
};

export const postUpdate = async (post: PostUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${post.id}`, {
      method: EnumRequest.PUT,
      credentials: 'include',
      headers: await authHeaders(headers.withBody),
      body: JSON.stringify(post),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update post):', error);
    throw error;
  }
};

export const postDelete = async (postId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${postId}`, {
      method: EnumRequest.DELETE,
      credentials: 'include',
      headers: await authHeaders(headers.withoutBody),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete post):', error);
    throw error;
  }
};
