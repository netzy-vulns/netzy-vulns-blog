"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import CopyButton from "./CopyButton"
import "highlight.js/styles/github-dark.css"

function extractText(children: unknown): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(extractText).join("")
  if (typeof children === "object" && children !== null) {
    const element = children as { props?: { children?: unknown } }
    if (element.props?.children !== undefined) {
      return extractText(element.props.children)
    }
  }
  return ""
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-red max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          code({ className, children, ...props }) {
            const isBlock = className?.includes("language-")
            const codeString = extractText(children)

            if (isBlock) {
              return (
                <div className="relative group">
                  <CopyButton code={codeString} />
                  <code className={className} {...props}>
                    {children}
                  </code>
                </div>
              )
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
