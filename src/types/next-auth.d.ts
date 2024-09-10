import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    userInfo: {
      firstName?: string;
      lastName?: string;
      username?: string;
      avatarUrl?: string;
      accessToken?: string;
      OAuthProvider?: string;
      providerId?: string;
    };
  }
}

declare module 'next-auth' {
  interface Profile {
    given_name?: string;
    family_name?: string;
    picture?: string;
  }
}