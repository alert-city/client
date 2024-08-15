'use client';
import React from 'react';
import { FINDALLUSERS} from '@/graphql/user';
import  { useQuery } from '@apollo/client';
import Submission  from '@/modules/submission/Submission';

const SubmissionPage: React.FC = () => {
const { data } = useQuery(FINDALLUSERS);

console.log("all users", data);

  return (
    <div>
      <Submission />
    </div>
  );
};

export default SubmissionPage;