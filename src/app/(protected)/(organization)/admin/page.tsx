import React from 'react';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Submission.Metadata

const page: React.FC = () => {
  return (
    <div>
      <h1>Admin page</h1>
    </div>
  );
};

export default page;