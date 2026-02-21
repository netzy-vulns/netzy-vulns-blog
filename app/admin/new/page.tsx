"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [published, setPublished] = useState(false)
  const [coverImage, setCoverImage] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // 제목으로 슬러그 자동 생성
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, "")
        .replace(/\s+/g, "-")
    )
  }

  // 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    if (data.url) setCoverImage(data.url)
    setUploading(false)
  }

  // 글 저장
  const handleSubmit = async () => {
    if (!title || !slug || !content) {
      alert("제목, 슬러그, 내용은 필수입니다.")
      return
    }

    setSaving(true)
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        content,
        excerpt,
        coverImage,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        published,
      }),
    })

    if (res.ok) {
      router.push("/admin")
    } else {
      alert("글 저장에 실패했습니다.")
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-red-500">새 글 작성</h1>
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-400 hover:text-white transition"
          >
            ← 돌아가기
          </button>
        </div>

        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">제목 *</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="게시글 제목"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* 슬러그 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">슬러그 *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* 요약 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">요약</label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="글 목록에서 보여질 요약"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="RedTeam, CVE, Malware"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* 대표 이미지 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">대표 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white"
            />
            {uploading && <p className="text-yellow-500 text-sm mt-1">업로드 중...</p>}
            {coverImage && (
              <img src={coverImage} alt="cover" className="mt-2 h-32 rounded-lg object-cover" />
            )}
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">내용 *</label>
            <div data-color-mode="dark">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={400}
              />
            </div>
          </div>

          {/* 공개 여부 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-red-500"
            />
            <label htmlFor="published" className="text-gray-400">
              공개로 발행
            </label>
          </div>

          {/* 저장 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-red-900 hover:bg-red-800 disabled:bg-gray-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {saving ? "저장 중..." : "글 저장"}
          </button>
        </div>
      </div>
    </div>
  )
}
