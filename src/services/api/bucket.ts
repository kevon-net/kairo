'use server';

import { createClient } from '@/libraries/supabase/server';

export const bucketCreate = async (params: { bucketName: string }) => {
  try {
    const supabase = await createClient();

    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) throw listError;

    const bucketExists = buckets.some(
      (bucket) => bucket.name === params.bucketName
    );

    if (bucketExists) {
      return;
    }

    // Create bucket with provided options
    const { error: createError } = await supabase.storage.createBucket(
      params.bucketName,
      { public: true }
    );

    if (createError) throw createError;
  } catch (error) {
    console.error('---> service error (create bucket):', error);
    throw error;
  }
};
