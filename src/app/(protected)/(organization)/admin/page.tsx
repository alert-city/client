import React from 'react';
import { RouteConfig } from '@/routes/route';
import SubmissionPage from '@/modules/submission/Submission';

export const metadata = RouteConfig.Submission.Metadata;

const page: React.FC = () => {
  return (
    <div>
      <SubmissionPage />
    </div>
  );
};

export default page;