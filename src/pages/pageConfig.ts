interface IRoute {
  page: string[];
  // component: () => JSX.Element;
}

export const PAGE_KEY = {
  SETTING: 'setting',
  SIDE_BAR_ADMIN: 'side_bar',
  SIDE_BAR_PERSONAL: 'side_bar_personal',
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
};


export const getPageByKey = (key: string) => PAGE_CONFIG[key];

