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
        console.log("Authorize:", credentials);
        try {
          const res = await axios.post("http://backend:8000/login", {
            email: credentials?.email,
            password: credentials?.password,
          });
          console.log("Backend response status:", res.status);
          console.log("Backend Response Data:", res.data);
          const user = res.data;
          if (user && user.access_token) {
            console.log("Authorize Success - User:", user);
            return { id: user.user_id.toString(), email: credentials?.email, name: user.name };
          } else {
            console.log("Authorize Failed - No access_token");
          }
          return null;
        } catch (error) {
          console.error("Authorize Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      console.log("JWT Callback - Token:", token, "User:", user);
      if (user) {
        const payload = token as JwtPayload;
        payload.accessToken = (user as any).accessToken ?? "";
        payload.role = (user as any).role ?? "";
        console.log("JWT Callback - Updated Token:", token);
      }
      return token;
    },
    async session({ session, token }: { session: NextAuthSession; token: JWT }): Promise<MySession> {
      console.log("Session Callback - Session:", session, "Token:", token);
      if (token) {
        (session as MySession).accessToken = token.accessToken as string;
        if (session.user) {
          (session.user as any).role = token.role as string;
        }
        console.log("Session Callback - Updated Session:", session);
      }
      return session as MySession;
    },
  },
  pages: {
    signIn: "/login",
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
