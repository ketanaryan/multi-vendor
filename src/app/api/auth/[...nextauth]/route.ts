import NextAuth, { AuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';

// Extend NextAuth User and AdapterUser types to include 'role'
declare module 'next-auth' {
  interface User {
    role: 'customer' | 'vendor' | 'admin';
    id: string;
    name?: string | null;
    email?: string | null;
  }
  interface Session {
    user: {
      id: string;
      role: 'customer' | 'vendor' | 'admin';
      name?: string | null;
      email?: string | null;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'customer' | 'vendor' | 'admin';
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'customer' | 'vendor' | 'admin';
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };