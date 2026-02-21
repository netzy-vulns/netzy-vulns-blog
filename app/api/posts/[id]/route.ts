import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { auth } from "@/auth"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

// GET /api/posts/[id] - 단일 글 조회
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, parseInt(id)))

    if (!post.length) {
      return NextResponse.json(
        { error: "글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json(post[0])
  } catch (error) {
    return NextResponse.json(
      { error: "글을 불러오지 못했습니다." },
      { status: 500 }
    )
  }
}

// PATCH /api/posts/[id] - 글 수정
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const { title, slug, content, excerpt, coverImage, tags, published } = body

    const updatedPost = await db
      .update(posts)
      .set({
        title,
        slug,
        content,
        excerpt,
        coverImage,
        tags,
        published,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, parseInt(id)))
      .returning()

    if (!updatedPost.length) {
      return NextResponse.json(
        { error: "글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedPost[0])
  } catch (error) {
    return NextResponse.json(
      { error: "글 수정에 실패했습니다." },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - 글 삭제
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const { id } = await params

    const deletedPost = await db
      .delete(posts)
      .where(eq(posts.id, parseInt(id)))
      .returning()

    if (!deletedPost.length) {
      return NextResponse.json(
        { error: "글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "삭제되었습니다." })
  } catch (error) {
    return NextResponse.json(
      { error: "글 삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}
