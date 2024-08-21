interface IRoute {
  page?: string[];
  question?: { value: string; label: string }[];
  accountType?: string;
  // component: () => JSX.Element;
}

export const PAGE_KEY = {
  SETTING: 'setting',
  SIDE_BAR_ADMIN: 'side_bar',
  SIDE_BAR_PERSONAL: 'side_bar_personal',
  SECURITY_QUESTIONS: 'security_question',
  ORGANIZATION: 'Organization',
  PERSONAL: 'Personal',
};


export const PAGE_CONFIG: Record<string, IRoute> = {
  [PAGE_KEY.SETTING]: {
    page: ['Profile', 'Reset Password', 'Logout']
  },
  [PAGE_KEY.SIDE_BAR_ADMIN]: {
    page: ['Review', 'Submission']
  },
  [PAGE_KEY.SIDE_BAR_PERSONAL]: {
    page: ['Submission']
  },
  [PAGE_KEY.ORGANIZATION]: {
    accountType: "Organization"
  },
  [PAGE_KEY.PERSONAL]: {
    accountType: "Personal"
  },
  [PAGE_KEY.SECURITY_QUESTIONS]: {
    question: [
      { value: 'What is your mother\'s maiden name?', label: "What is your mother's maiden name?" },
      { value: 'What was the name of your first pet?', label: "What was the name of your first pet?" },
      { value: 'What was your first car?', label: "What was your first car?" },
      { value: 'What was the name of your first school?', label: "What was the name of your first school?" },
      { value: 'Who was your favorite teacher?', label: "Who was your favorite teacher?" },
      { value: 'In what city were you born?', label: "In what city were you born?" },
      { value: 'What is your favorite food?', label: "What is your favorite food?" },
    ]
  }
};


export const getPageByKey = (key: string) => PAGE_CONFIG[key];

