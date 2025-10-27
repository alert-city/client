import React from 'react';
import { RouteConfig } from '@/routes/route';
import ReviewModule from '@/modules/review/Review';

export const metadata = RouteConfig.Review.Metadata

const ReviewPage: React.FC = () => {
    return (
        <div className="min-h-screen flex justify-center items-center px-4 py-6">
            <ReviewModule/>
        </div>
    );
};

export default ReviewPage;