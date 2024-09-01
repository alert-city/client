import React from 'react';
import Submission  from '@/modules/submission/Submission';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Submission.Metadata

const SubmissionPage: React.FC = () => {
  return (
    <div>
      <Submission />
    </div>
  );
};

export default SubmissionPage;