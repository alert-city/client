import React from 'react';
import { RouteConfig } from '@/routes/route';
import ReviewModule from '@/modules/review/Review';

export const metadata = RouteConfig.Review.Metadata

const ReviewPage: React.FC = () => {
  return (
    <ReviewModule/>
  );
};

export default ReviewPage;