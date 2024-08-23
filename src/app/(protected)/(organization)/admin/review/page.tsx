import React from 'react';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Review.Metadata

const ReviewPage: React.FC = () => {
  return (
    <div>
      <h1>Review page</h1>
    </div>
  );
};

export default ReviewPage;