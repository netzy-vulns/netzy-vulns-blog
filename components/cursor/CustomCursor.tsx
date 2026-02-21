"use client"

import { useEffect, useState } from "react"

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let trailId = 0

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e
      setPosition({ x, y })
      setIsVisible(true)

      // trailing effect
      trailId++
      const id = trailId
      setTrail((prev) => [...prev.slice(-12), { x, y, id }])

      // 커서 타겟 확인 (링크, 버튼 위에 있는지)
      const target = e.target as HTMLElement
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer"
      setIsPointer(!!isClickable)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Trail 효과 */}
      {trail.map((point, index) => {
        const size = (index / trail.length) * 8
        const opacity = (index / trail.length) * 0.4
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-[9998] rounded-full bg-red-600"
            style={{
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: size,
              height: size,
              opacity,
              transform: "translate(-50%, -50%)",
            }}
          />
        )
      })}

      {/* 메인 커서 중앙 점 */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full bg-red-500 transition-all duration-75"
        style={{
          left: position.x,
          top: position.y,
          width: isPointer ? 6 : 4,
          height: isPointer ? 6 : 4,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  )
}
