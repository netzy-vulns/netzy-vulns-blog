import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { auth } from "@/auth"
import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"

// GET /api/posts - 글 목록 조회
export async function GET() {
  try {
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))

    return NextResponse.json(allPosts)
  } catch (error) {
    return NextResponse.json(
      { error: "글 목록을 불러오지 못했습니다." },
      { status: 500 }
    )
  }
}

// POST /api/posts - 글 작성
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

    const body = await req.json()
    const { title, slug, content, excerpt, coverImage, tags, published } = body

    // 필수값 확인
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "제목, 슬러그, 내용은 필수입니다." },
        { status: 400 }
      )
    }

    const newPost = await db
      .insert(posts)
      .values({
        title,
        slug,
        content,
        excerpt,
        coverImage,
        tags,
        published,
      })
      .returning()

    return NextResponse.json(newPost[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "글 작성에 실패했습니다." },
      { status: 500 }
    )
  }
}