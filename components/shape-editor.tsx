"use client"

import { useState } from "react"
import { Shape } from "./shape"
import { ControlPanel } from "./control-panel"
import { ThemeToggle } from "./theme-toggle"
import { Footer } from "./layout/footer"
import { Header } from "./layout/header"

type Point = {
  x: number
  y: number
  curveInward?: boolean
}

const defaultPoints: Point[] = [
  { x: 20, y: 20 },
  { x: 180, y: 20 },
  { x: 180, y: 180 },
  { x: 20, y: 180 },
]

export function ShapeEditor() {
  const [points, setPoints] = useState<Point[]>(defaultPoints)
  const [isRounded, setIsRounded] = useState(false)
  const [hideDragPoints, setHideDragPoints] = useState(false)
  const [cornerRadius, setCornerRadius] = useState(10)

  const handlePointDrag = (index: number, x: number, y: number) => {
    const newPoints = [...points]
    newPoints[index] = { ...newPoints[index], x, y }
    setPoints(newPoints)
  }

  const handleAddPoint = (x: number, y: number) => {
    setPoints([...points, { x, y }])
  }

  const toggleCurveDirection = (index: number) => {
    const newPoints = [...points]
    newPoints[index] = {
      ...newPoints[index],
      curveInward: !newPoints[index].curveInward,
    }
    setPoints(newPoints)
  }

  const resetShape = () => {
    setPoints(defaultPoints)
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container max-w-screen-2xl mx-auto py-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <Shape
                  points={points}
                  onPointDrag={handlePointDrag}
                  onAddPoint={handleAddPoint}
                  onToggleCurveDirection={toggleCurveDirection}
                  isRounded={isRounded}
                  hideDragPoints={hideDragPoints}
                  cornerRadius={cornerRadius}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <ControlPanel
                isRounded={isRounded}
                onToggleRounded={() => setIsRounded(!isRounded)}
                hideDragPoints={hideDragPoints}
                onToggleHideDragPoints={() => setHideDragPoints(!hideDragPoints)}
                cornerRadius={cornerRadius}
                onCornerRadiusChange={setCornerRadius}
                clipPath={`path("${generatePath()}")`}
                onReset={resetShape}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

