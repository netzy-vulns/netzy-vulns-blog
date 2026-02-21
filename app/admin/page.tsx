import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"

export default async function AdminPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const allPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-red-500">관리자 페이지</h1>
          <Link
            href="/admin/new"
            className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition"
          >
            + 새 글 작성
          </Link>
        </div>

        {/* 글 목록 */}
        <div className="space-y-4">
          {allPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              아직 작성된 글이 없습니다.
            </p>
          ) : (
            allPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-white">{post.title}</h2>
                  <div className="flex gap-3 mt-1">
                    <span className="text-gray-500 text-sm">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("ko-KR")
                        : ""}
                    </span>
                    <span
                      className={`text-sm ${
                        post.published ? "text-green-500" : "text-yellow-500"
                      }`}
                    >
                      {post.published ? "공개" : "비공개"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition"
                  >
                    수정
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
