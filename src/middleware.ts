import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { match } from 'path-to-regexp'

function isMatch(pathname: string, urls: string[]) {
  return urls.some((url) => !!match(url)(pathname))
}
const matchersForSignIn = ['/signup', '/login']

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/svg')) {
    return NextResponse.next()
  }
  // if (!req?.auth?.accessToken && !isMatch(req.nextUrl.pathname, matchersForSignIn)) {
  //   const newUrl = new URL('/login', req.nextUrl.origin)
  //   return Response.redirect(newUrl)
  // } else {
  //   const baseUrl = process.env.API_URL || 'http://localhost:3000'
  //   if (req.auth) {
  //     const result = await fetch(`${baseUrl}/api/auth/tokenVerify`, {
  //       method: 'GET',
  //       headers: {
  //         authorization: `Bearer ${req.auth.accessToken}`,
  //       },
  //     })
  //     const { error } = await result.json()
  //     if (error && !isMatch(req.nextUrl.pathname, matchersForSignIn)) {
  //       const newUrl = new URL('/login', req.nextUrl.origin)
  //       return Response.redirect(newUrl)
  //     }
  //   }
  // }
})

////
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
