import React from 'react';
import { typeParams } from '../layout';
import {
  extractSlugFromParam,
  extractUuidFromParam,
} from '@/utilities/helpers/string';
import PartialListingProject from '@/components/partial/listings/project';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default async function App({ params }: { params: Promise<typeParams> }) {
  const projectId = extractUuidFromParam(
    (await params)['projectTitle-projectId']
  );
  const projectTitle = extractSlugFromParam(
    (await params)['projectTitle-projectId']
  );

  return (
    <div>
      <PartialListingProject props={{ projectId, projectTitle }} />
    </div>
  );
}
