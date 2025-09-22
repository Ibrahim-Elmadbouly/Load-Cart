import Credentials from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';


export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== 'production',
  
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
          });
          const data = await res.json().catch(() => ({}));
          if (process.env.NODE_ENV !== 'production') {
            console.log('[auth][authorize] status:', res.status);
            console.log('[auth][authorize] data:', data);
          }
          if (!res.ok || !data?.token) return null;
          return {
            id: data.user?._id || 'user',
            name: data.user?.name || 'User',
            email: data.user?.email || credentials.email,
            token: data.token,
            user: data.user || null,
          } as any;
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('[auth][authorize] error:', e);
          }
          return null;
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).accessToken = (user as any).token;
        const rawUser = (user as any).user || {};
        (token as any).user = {
          _id: (rawUser as any)?._id || (user as any)?.id || (token as any)?.sub || 'user',
          name: (rawUser as any)?.name ?? (user as any).name,
          email: (rawUser as any)?.email ?? (user as any).email,
          ...rawUser,
        } as any;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      const mergedUser = (token as any).user || session.user || {};
      const stableId = (mergedUser as any)?._id || (token as any)?.sub || (session as any)?.user?.id || 'user';
      (session as any).user = { id: stableId, _id: stableId, ...mergedUser } as any;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
