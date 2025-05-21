import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { match } from 'path-to-regexp'
import { getUserInfo } from '@/serverActions/handler'

function isMatch(pathname: string, urls: string[]) {
  return urls.some((url) => !!match(url)(pathname))
}

const requireAdminPath = '/manage'
const requireLoginpath = ['/products/cart', '/users']
const whyhere = ['/login', '/signup']

export default auth(async (req) => {
  // const { pathname } = req.nextUrl
  // if (pathname.startsWith('/svg')) {
  //   return NextResponse.next()
  // }
  const token = await auth()
  if (req.nextUrl.pathname.includes(requireAdminPath)) {
    if (token?.accessToken) {
      const user = await getUserInfo()
      if (user && user.role !== 'admin') {
        const newUrl = new URL('/login', req.nextUrl.origin)
        return Response.redirect(newUrl)
      }
    } else {
      const newUrl = new URL('/login', req.nextUrl.origin)
      return Response.redirect(newUrl)
    }
  }
  if (isMatch(req.nextUrl.pathname, requireLoginpath)) {
    //유저정보가 필요한 페이지
    const newUrl = new URL('/login', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
  // if (isMatch(req.nextUrl.pathname, whyhere) && token?.accessToken) {
  //   //
  //   const newUrl = new URL('/home', req.nextUrl.origin)
  //   console.info('🚀 newUrl:', newUrl)
  //   return Response.redirect(newUrl)
  // }
})

////
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
