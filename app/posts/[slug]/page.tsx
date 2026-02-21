import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { notFound } from "next/navigation"
import MarkdownRenderer from "@/components/blog/MarkdownRenderer"
import ReadingTime from "@/components/blog/ReadingTime"
import TableOfContents from "@/components/blog/TableOfContents"

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))

  if (!post.length || !post[0].published) {
    notFound()
  }

  const data = post[0]

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

      {/* 본문 */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        {/* 목차 */}
        <TableOfContents content={data.content} />
        {/* 뒤로가기 */}
        <Link
          href="/"
          className="text-gray-400 hover:text-white text-sm mb-8 inline-block transition"
        >
          ← 목록으로
        </Link>

        {/* 대표 이미지 */}
        {data.coverImage && (
          <img
            src={data.coverImage}
            alt={data.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}

        {/* 태그 */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {data.tags.map((tag) => (
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
        <h1 className="text-4xl font-bold text-white mb-4">{data.title}</h1>

        {/* 날짜 */}
        <p className="text-gray-500 text-sm mb-12">
          {data.createdAt
            ? new Date(data.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </p>
        <p className="text-gray-500 text-sm mb-12">
            {data.createdAt
                ? new Date(data.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                : ""}
            <span className="mx-2 text-gray-700">·</span>
            <ReadingTime content={data.content} />
        </p>

        {/* 본문 내용 */}
        <MarkdownRenderer content={data.content} />
      </main>
    </div>
  )
}
