export default function ReadingTime({ content }: { content: string }) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)

  return (
    <span className="text-gray-500 text-sm">
      약 {minutes}분 소요
    </span>
  )
}
