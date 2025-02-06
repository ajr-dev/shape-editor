"use client"

import { useState } from "react"
import Shape from "./Shape"
import ControlPanel from "./ControlPanel"

type Point = {
  x: number
  y: number
  curveInward?: boolean // Add this to control curve direction
}

const defaultPoints: Point[] = [
  { x: 20, y: 20 },
  { x: 180, y: 20 },
  { x: 180, y: 180 },
  { x: 20, y: 180 },
]

export default function ShapeEditor() {
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

      const dx = next.x - current.x
      const dy = next.y - current.y
      const angle = Math.atan2(dy, dx)

      const prevDx = current.x - prev.x
      const prevDy = current.y - prev.y
      const prevAngle = Math.atan2(prevDy, prevDx)

      const r = cornerRadius

      // Calculate offset points for the corner
      const startX = current.x - r * Math.cos(prevAngle)
      const startY = current.y - r * Math.sin(prevAngle)
      const endX = current.x + r * Math.cos(angle)
      const endY = current.y + r * Math.sin(angle)

      if (i === 0) {
        path += `M ${startX},${startY}`
      } else {
        path += ` L ${startX},${startY}`
      }

      // Calculate sweep flag based on curve direction
      const sweepFlag = current.curveInward ? "0" : "1"

      // Calculate large arc flag based on angle difference
      const angleDiff = (angle - prevAngle + 2 * Math.PI) % (2 * Math.PI)
      const largeArcFlag = angleDiff > Math.PI ? "1" : "0"

      path += ` A ${r},${r} 0 ${largeArcFlag} ${sweepFlag} ${endX},${endY}`
    }

    return path + " Z"
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Visual Shape Editor</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
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
        <div className="flex-1">
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
  )
}

