import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from '../../../utils/prisma';
import bcrypt from 'bcrypt';
import { JWT } from "next-auth/jwt";

/**
   * This is the NextAuth configuration object.
   * 
   */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log(credentials)
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const authenticated = await bcrypt.compare(credentials.password, user.password)

        console.log(authenticated)
  
        if (authenticated) {
          let toReturn = { ...user, password: undefined }
          return toReturn
        } else {
          return null
        }
      },
    })
  ],
  session: { strategy: 'jwt' },
  jwt: {
    secret: process.env.SECRET,
  },
  callbacks: {
    async jwt({ token, user } : any): Promise<JWT> {
      return { ...token, ...user, picture: undefined, name: undefined }
    },
    async session({ session, token }: any) {
      return {
       ...session,
       user: {...token}
      }
    }
  },
  secret: process.env.SECRET,
}

// @ts-expect-error
export default NextAuth(authOptions) 