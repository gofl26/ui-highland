import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}
export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error('Missing credentials')
        }
        const { email, password, userName, phoneNumber, gender } = credentials
        const baseUrl = process.env.API_URL || 'http://localhost:3000'
        if (userName) {
          //회원가입
          const result = await fetch(`${baseUrl}/api/users/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              userName,
              phoneNumber,
              gender,
            }),
          })
          const responseData = await result.json()
          if (!result.ok) {
            throw new CustomError(responseData.error || 'Failed signup')
          }
          const { accessToken } = responseData
          return {
            accessToken,
          }
        } else {
          //로그인
          const result = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          })
          const responseData = await result.json()
          if (!result.ok) {
            throw new CustomError(responseData.error || 'Failed signin')
          }
          const { accessToken } = responseData
          return {
            accessToken,
          }
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    signIn: async () => {
      return true
    },
    jwt: async ({ token, user }) => {
      //accessToken은 next-auth 라이브러리에 정의되지않은 타입이므로 /types/auth.d.ts에 별도 타입 추가
      if (user) {
        token.accessToken = user.accessToken
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
      }
      return session
    },
  },
}
