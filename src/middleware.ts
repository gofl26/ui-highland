import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserInfo } from '@/serverActions/handler'

function isMatch(pathname: string, paths: string[]) {
  return paths.some((path) => pathname.startsWith(path))
}

const requireLoginPaths = ['/user', '/manage']
const redirectIfLoggedInPaths = ['/login', '/signup']

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const token = await auth()
  // ✅ 1. 토큰이 없으면 로그인 필수 페이지 → /login 으로 리다이렉트
  if (!token?.accessToken && isMatch(pathname, requireLoginPaths)) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ✅ 2. 토큰이 있으면 로그인/회원가입 페이지 → /home 으로 리다이렉트
  if (token?.accessToken && isMatch(pathname, redirectIfLoggedInPaths)) {
    const url = req.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  // ✅ 3. 토큰이 있고 /manage 접근 중이면 role 검사
  if (pathname.includes('/manage')) {
    const user = await getUserInfo()
    if (user?.role !== 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
