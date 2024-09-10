import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        if (account.provider === 'google') {
          token.given_name = profile.given_name;
          token.family_name = profile.family_name;
          token.picture = profile.picture;
          token.provider = account.provider;
          token.providerId = account.providerAccountId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.userInfo = {
        firstName: token.given_name as string | undefined,
        lastName: token.family_name as string | undefined,
        username: token.email as string | undefined,
        avatarUrl: token.picture as string | undefined,
        accessToken: token.accessToken as string | undefined,
        OAuthProvider: token.provider as string | undefined,
        providerId: token.providerId as string | undefined,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };