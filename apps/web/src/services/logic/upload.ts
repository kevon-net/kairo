'use server';

import { createClient } from '@/libraries/supabase/server';
import { bucketCreate } from '../api/bucket';
import { BUCKET_NAME, FILE_NAME } from '@/data/constants';

export const uploadFile = async (params: {
  formData: FormData;
  profileId: string;
}) => {
  try {
    const supabase = await createClient();

    await bucketCreate({ bucketName: BUCKET_NAME.AVATARS });

    const file = params.formData.get(FILE_NAME.AVATAR) as File;

    // Get file extension
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${params.profileId}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME.AVATARS)
      .upload(fileName, file, {
        upsert: true, // This will create if doesn't exist or update if does
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from(BUCKET_NAME.AVATARS)
      .getPublicUrl(fileName);

    // Return file details
    return {
      file: {
        name: fileName,
        size: file.size,
        path: `${data.publicUrl}?size=${file.size}`,
      },
    };
  } catch (error) {
    console.error('---> service error (upload avatar):', error);
    throw error;
  }
};
