import NextAuth, { AuthError } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

class customError extends AuthError {
  constructor(message: string) {
    super()
    this.message = message
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { userName, password, displayName } = credentials
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        if (displayName) {
          //회원가입
          const result = await fetch(`${baseUrl}/api/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userName,
              password,
              displayName,
            }),
          })
          const responseData = await result.json()
          if (!result.ok) {
            throw new customError(responseData.error || 'Failed signup')
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
              userName,
              password,
            }),
          })
          const responseData = await result.json()
          if (!result.ok) {
            throw new customError(responseData.error || 'Failed signin')
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
})
