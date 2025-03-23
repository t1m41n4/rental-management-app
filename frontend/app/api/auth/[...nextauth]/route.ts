// frontend/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, Session as NextAuthSession, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JWT, JwtPayload } from "next-auth/jwt";
import { SessionStrategy } from "next-auth";

export interface MySession extends NextAuthSession {
  accessToken?: string;
  user?: User & {
    role?: string;
  };
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const res = await axios.post("http://backend:8000/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (res.data.access_token) {
            return {
              id: res.data.user_id?.toString() || "0",
              email: credentials?.email || "",
              role: res.data.role,
              accessToken: res.data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          role: user.role,
          refreshToken: user.refreshToken,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user,
          role: token.role,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' satisfies SessionStrategy },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: "localhost",
        secure: false,
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
