import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin")

  if (isAdminPage && !isLoggedIn) {
    // 로그인 안 된 상태로 /admin 접근 시 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
