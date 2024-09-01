import React from 'react';
import SubmissionPage from '@/modules/submission/Submission';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Submission.Metadata

const page: React.FC = () => {
  return (
    <div>
      <SubmissionPage />
    </div>
  );
};

export default page;