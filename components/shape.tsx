"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { useDrag } from "@use-gesture/react"
import { Grid } from "./editor/grid"

interface ShapeProps {
  points: { x: number; y: number; curveInward?: boolean }[]
  onPointDrag: (index: number, x: number, y: number) => void
  onAddPoint: (x: number, y: number) => void
  onToggleCurveDirection: (index: number) => void
  isRounded: boolean
  hideDragPoints: boolean
  cornerRadius: number
  snapToGrid: boolean
}

export function Shape({
  points,
  onPointDrag,
  onAddPoint,
  onToggleCurveDirection,
  isRounded,
  hideDragPoints,
  cornerRadius,
  snapToGrid,
}: ShapeProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const snapToNearestPoint = (x: number, y: number): { x: number; y: number } => {
    if (!snapToGrid) return { x, y }
    const gridSize = 10
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    }
  }

  const getMousePosition = (event: PointerEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const svgRect = svgRef.current.getBoundingClientRect()
    const x = (event.clientX - svgRect.left) * (200 / svgRect.width)
    const y = (event.clientY - svgRect.top) * (200 / svgRect.height)
    return { x: Math.max(0, Math.min(200, x)), y: Math.max(0, Math.min(200, y)) }
  }

  const bind = useDrag(({ event, args: [index] }) => {
    const { x, y } = getMousePosition(event as PointerEvent)
    const snappedPosition = snapToNearestPoint(Math.round(x), Math.round(y))
    onPointDrag(index, snappedPosition.x, snappedPosition.y)
  })

  useEffect(() => {
    const svg = svgRef.current
    if (svg) {
      const preventScroll = (e: TouchEvent) => e.preventDefault()
      svg.addEventListener("touchmove", preventScroll, { passive: false })
      return () => svg.removeEventListener("touchmove", preventScroll)
    }
  }, [])

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    const { x, y } = getMousePosition(event as unknown as MouseEvent)
    onAddPoint(Math.round(x), Math.round(y))
  }

  const handleAuxClick = (event: React.MouseEvent, index: number) => {
    if (event.button === 1) {
      event.preventDefault()
      onToggleCurveDirection(index)
    }
  }

  const generatePath = () => {
    if (!isRounded) {
      return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") + " Z"
    }

    const len = points.length
    let path = ""

    for (let i = 0; i < len; i++) {
      const current = points[i]
      const next = points[(i + 1) % len]
      const prev = points[(i - 1 + len) % len]

      // Calculate the direction vectors
      const toPrev = { x: prev.x - current.x, y: prev.y - current.y }
      const toNext = { x: next.x - current.x, y: next.y - current.y }

      // Normalize vectors
      const toPrevLen = Math.sqrt(toPrev.x * toPrev.x + toPrev.y * toPrev.y)
      const toNextLen = Math.sqrt(toNext.x * toNext.x + toNext.y * toNext.y)

      const toPrevNorm = {
        x: toPrev.x / toPrevLen,
        y: toPrev.y / toPrevLen,
      }
      const toNextNorm = {
        x: toNext.x / toNextLen,
        y: toNext.y / toNextLen,
      }

      // Calculate control points at a fraction of the distance
      const r = cornerRadius
      const controlDist = r * 2 // Increase this value for smoother curves

      const startX = current.x + toPrevNorm.x * controlDist
      const startY = current.y + toPrevNorm.y * controlDist
      const endX = current.x + toNextNorm.x * controlDist
      const endY = current.y + toNextNorm.y * controlDist

      if (i === 0) {
        path += `M ${startX},${startY}`
      } else {
        path += ` L ${startX},${startY}`
      }

      // Use quadratic Bézier curve for smoother transitions
      path += ` Q ${current.x},${current.y} ${endX},${endY}`
    }

    return path + " Z"
  }

  return (
    <div className="relative w-full aspect-square">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        className="rounded-md border border-border bg-background"
        onContextMenu={handleContextMenu}
      >
        {snapToGrid && <Grid size={10} />}
        <path
          d={generatePath()}
          className="fill-blue-100 dark:fill-blue-950 stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="1"
        />
        {!hideDragPoints &&
          points.map(({ x, y, curveInward }, index) => (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="3"
                className={`${"fill-red-500 dark:fill-red-400"}`}
                opacity={hideDragPoints ? 0.2 : 1}
                {...bind(index)}
                onAuxClick={(e) => handleAuxClick(e, index)}
                style={{ touchAction: "none", cursor: "move" }}
              />
              <title>{"Drag to change shape"}</title>
            </g>
          ))}
      </svg>
    </div>
  )
}

