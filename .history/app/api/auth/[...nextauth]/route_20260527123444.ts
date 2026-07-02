// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'


if (!prisma) {
  throw new Error('Prisma client not initialized')
}

const authOptions = {
  adapter: {
  ...PrismaAdapter(prisma),
  getUserByAccount: async (providerAccountId: any) => {
    const account = await (prisma as any).account.findUnique({
      where: {
        provider_provider_account_id: {
          provider: providerAccountId.provider,
          provider_account_id: providerAccountId.providerAccountId,
        },
      },
      include: { user: true },
    });
    return account?.user ?? null;
  },
  createUser: async (data: any) => {
    const { emailVerified, ...rest } = data;
    return (prisma as any).user.create({
      data: {
        ...rest,
        email_verified: emailVerified,
      },
    });
  },
  linkAccount: async (data: any) => {
    const { providerAccountId, userId, ...rest } = data;
    return (prisma as any).account.create({
      data: {
        ...rest,
        provider_account_id: providerAccountId,
        user_id: userId,
      },
    });
  },
} as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('User not found')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        (session.user as any).role = token.role;
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }