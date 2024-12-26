'use client';

import React from 'react';

import {
  Avatar as MantineAvatar,
  Box,
  Button,
  Stack,
  Text,
  ThemeIcon,
  Flex,
} from '@mantine/core';
import { IconUpload, IconUserCircle, IconX } from '@tabler/icons-react';
import {
  Dropzone,
  DropzoneAccept,
  DropzoneIdle,
  DropzoneProps,
  DropzoneReject,
  IMAGE_MIME_TYPE,
} from '@mantine/dropzone';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useFormUserAvatar } from '@/hooks/form/account/profile';

export default function Avatar({ ...restProps }: Partial<DropzoneProps>) {
  const { file, preview, handleSubmit, setFile, setPreview, submitted } =
    useFormUserAvatar();

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  return (
    <Stack align="start">
      <Dropzone
        onDrop={(files) => handleFileChange(files[0])}
        onReject={() => {
          setFile(null);
          setPreview(null);
        }}
        maxSize={1 * 1024 ** 2}
        maxFiles={1}
        accept={IMAGE_MIME_TYPE}
        {...restProps}
      >
        <Box style={{ pointerEvents: 'none' }}>
          <DropzoneAccept>
            <DropZoneLayout>
              <ThemeIcon size={80} variant="light" color="blue.6">
                <IconUpload
                  size={ICON_SIZE * 3}
                  stroke={ICON_STROKE_WIDTH}
                  color={'var(--mantine-color-blue-6)'}
                />
              </ThemeIcon>

              <Stack gap={4}>
                <Text>File accepted</Text>

                <Stack gap={0}>
                  <Text fz="sm" c="dimmed">
                    <Text inherit component="span" fw={'bold'}>
                      Accepted Types
                    </Text>
                    : png, gif, jpeg, svg+xml, webp, avif, heic, heif
                  </Text>

                  <Text fz="sm" c="dimmed">
                    <Text inherit component="span" fw={'bold'}>
                      Max size
                    </Text>
                    : 1 MB
                  </Text>
                </Stack>
              </Stack>
            </DropZoneLayout>
          </DropzoneAccept>

          <DropzoneReject>
            <DropZoneLayout>
              <ThemeIcon size={80} variant="light" color="red.6">
                <IconX
                  size={ICON_SIZE * 3}
                  stroke={ICON_STROKE_WIDTH}
                  color={'var(--mantine-color-red-6)'}
                />
              </ThemeIcon>

              <Stack gap={4}>
                <Text c={'red.6'}>
                  File size too large or file type unaccepted
                </Text>

                {description}
              </Stack>
            </DropZoneLayout>
          </DropzoneReject>

          <DropzoneIdle>
            <DropZoneLayout>
              {file ? (
                <MantineAvatar src={preview} size={80} radius={'sm'} />
              ) : (
                <ThemeIcon size={80} variant="light" color="gray">
                  <IconUserCircle
                    size={ICON_SIZE * 3}
                    stroke={ICON_STROKE_WIDTH}
                    color={'var(--mantine-color-gray-6)'}
                  />
                </ThemeIcon>
              )}

              <Stack gap={4}>
                {file ? (
                  <Text>File accepted</Text>
                ) : (
                  <Text>Drag image here or click to select file</Text>
                )}

                {description}
              </Stack>
            </DropZoneLayout>
          </DropzoneIdle>
        </Box>
      </Dropzone>

      <Button onClick={handleSubmit} disabled={!file} loading={submitted}>
        Upload
      </Button>
    </Stack>
  );
}

const description = (
  <Stack
    gap={0}
    c={'light-dark(var(--mantine-color-gray-6),var(--mantine-color-text))'}
  >
    <Text inherit fz="sm">
      <Text inherit component="span" fw={'bold'}>
        Accepted Types
      </Text>
      : png, gif, jpeg, svg+xml, webp, avif, heic, heif
    </Text>

    <Text inherit fz="sm">
      <Text inherit component="span" fw={'bold'}>
        Max size
      </Text>
      : 1 MB
    </Text>
  </Stack>
);

function DropZoneLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      align={{ base: 'start', xs: 'center' }}
      direction={{ base: 'column', xs: 'row' }}
      gap={'md'}
    >
      {children}
    </Flex>
  );
}
