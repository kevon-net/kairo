import { Request as EnumRequest } from '@repo/enums';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/upload`;

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const request = new Request(API_URL, {
      method: EnumRequest.POST,
      body: formData,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (upload file):', error);
    throw error;
  }
};
