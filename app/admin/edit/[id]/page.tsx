"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
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
  const [deleting, setDeleting] = useState(false)

  // 기존 글 불러오기
  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "")
        setSlug(data.slug || "")
        setExcerpt(data.excerpt || "")
        setContent(data.content || "")
        setTags(data.tags?.join(", ") || "")
        setPublished(data.published || false)
        setCoverImage(data.coverImage || "")
      })
  }, [id])

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

  // 글 수정
  const handleSubmit = async () => {
    if (!title || !slug || !content) {
      alert("제목, 슬러그, 내용은 필수입니다.")
      return
    }

    setSaving(true)
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
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
      alert("글 수정에 실패했습니다.")
    }
    setSaving(false)
  }

  // 글 삭제
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return

    setDeleting(true)
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      router.push("/admin")
    } else {
      alert("글 삭제에 실패했습니다.")
    }
    setDeleting(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-red-500">글 수정</h1>
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
              onChange={(e) => setTitle(e.target.value)}
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

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-red-900 hover:bg-red-800 disabled:bg-gray-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {saving ? "저장 중..." : "글 수정"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 text-red-500 px-6 py-3 rounded-lg font-semibold transition"
            >
              {deleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
