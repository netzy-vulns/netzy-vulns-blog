import { put } from "@vercel/blob"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // 로그인 확인
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "파일이 없습니다." },
        { status: 400 }
      )
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "이미지 파일만 업로드 가능합니다." },
        { status: 400 }
      )
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 5MB 이하여야 합니다." },
        { status: 400 }
      )
    }

    const blob = await put(file.name, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "이미지 업로드에 실패했습니다." },
      { status: 500 }
    )
  }
}
