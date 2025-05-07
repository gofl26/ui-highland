export declare module 'next-auth' {
  interface User {
    accessToken: string
    sessionId: string
  }
  interface Session {
    accessToken: string
    sessionId: string
  }
}
export declare module '@auth/core/jwt' {
  interface JWT {
    accessToken: string
    sessionId: string
  }
}
