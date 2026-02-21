"use client"

import { useEffect, useState } from "react"

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // 마크다운에서 헤딩 추출
  useEffect(() => {
    const lines = content.split("\n")
    const extracted: Heading[] = []

    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9가-힣\s]/g, "")
          .replace(/\s+/g, "-")
        extracted.push({ id, text, level })
      }
    })

    setHeadings(extracted)
  }, [content])

  // 스크롤 시 활성 헤딩 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 w-56">
      <div className="border-l border-gray-800 pl-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
          목차
        </p>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
            >
              <a
                href={`#${heading.id}`}
                className={`text-xs transition-colors duration-200 block py-0.5 ${
                  activeId === heading.id
                    ? "text-red-400 font-medium"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
