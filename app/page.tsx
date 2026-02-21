import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import Link from "next/link"

export default async function HomePage() {
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 px-8 py-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-red-500">
            netzy-vulns
          </Link>
          <nav className="flex gap-6 text-gray-400 text-sm">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/admin" className="hover:text-white transition">Admin</Link>
          </nav>
        </div>
      </header>

      {/* 메인 */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        {/* 소개 */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">
            Offensive Security Research
          </h1>
          <p className="text-gray-400">
            Red Teaming, Threat Modeling, 보안 인프라 설계 및 보안 기술 연구
          </p>
        </div>

        {/* 글 목록 */}
        <div className="space-y-6">
          {allPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              아직 작성된 글이 없습니다.
            </p>
          ) : (
            allPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="block bg-gray-900 border border-gray-800 hover:border-red-900 rounded-lg p-6 transition"
              >
                {/* 대표 이미지 */}
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                {/* 태그 */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-red-950 text-red-400 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 제목 */}
                <h2 className="text-xl font-semibold text-white mb-2">
                  {post.title}
                </h2>

                {/* 요약 */}
                {post.excerpt && (
                  <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                )}

                {/* 날짜 */}
                <p className="text-gray-600 text-xs">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("ko-KR")
                    : ""}
                </p>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
