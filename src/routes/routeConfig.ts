interface IRoute {
  path: string;
  name: string;
  title: string;
}

export const ROUTE_KEY = {
  LOGIN: 'login',
  REGISTER: 'register',
  RESET_PASSWORD: 'password',
  REVIEW: 'review',
  SUBMISSION: 'submission',
  PAGE_404: 'page_404',
  STAFF: 'staff',
  ADMIN: 'admin',
  NORMAL: 'normal',
  PROFILE: 'profile',
};

export const PUBLIC_ROUTE_CONFIG: Record<string, IRoute> = {
  [ROUTE_KEY.LOGIN]: {
    path: '/login',
    name: 'login',
    title: 'Login - Alert City',
  },
  [ROUTE_KEY.REGISTER]: {
    path: '/register',
    name: 'register',
    title: 'Register - Alert City',
  },
  [ROUTE_KEY.PAGE_404]: {
    path: '/404',
    name: '404',
    title: '404 - Alert City',
    // component: Page404,
  },
  [ROUTE_KEY.RESET_PASSWORD]: {
    path: '/reset-password',
    name: 'reset-password',
    title: 'Reset Password - Alert City',
  },
};

export const ROUTE_CONFIG: Record<string, IRoute> = {
  [ROUTE_KEY.REVIEW]: {
    path: '/review',
    name: 'review',
    title: 'Review - Alert City',
  },
  [ROUTE_KEY.SUBMISSION]: {
    path: '/submission',
    name: 'submission',
    title: 'Submission - Alert City',
  },
  [ROUTE_KEY.STAFF]: {
    path: '/staff',
    name: 'staff',
    title: 'Staff - Alert City',
  },
  [ROUTE_KEY.ADMIN]: {
    path: '/admin',
    name: 'admin',
    title: 'Admin - Alert City',
  },
  [ROUTE_KEY.NORMAL]: {
    path: '/normal',
    name: 'normal',
    title: 'Normal - Alert City',
  },
  [ROUTE_KEY.PROFILE]: {
    path: '/profile',
    name: 'profile',
    title: 'Profile - Alert City',
  },

};

export const getRouteByKey = (key: string) => ROUTE_CONFIG[key];
export const getPublicRouteByKey = (key: string) => PUBLIC_ROUTE_CONFIG[key];
