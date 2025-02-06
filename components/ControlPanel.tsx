"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Check, Copy, RotateCcw } from "lucide-react"

interface ControlPanelProps {
  isRounded: boolean
  onToggleRounded: () => void
  hideDragPoints: boolean
  onToggleHideDragPoints: () => void
  cornerRadius: number
  onCornerRadiusChange: (value: number) => void
  clipPath: string
  onReset: () => void
}

export default function ControlPanel({
  isRounded,
  onToggleRounded,
  hideDragPoints,
  onToggleHideDragPoints,
  cornerRadius,
  onCornerRadiusChange,
  clipPath,
  onReset,
}: ControlPanelProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`clip-path: ${clipPath};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Options</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="rounded-corners" checked={isRounded} onCheckedChange={onToggleRounded} />
            <Label htmlFor="rounded-corners">Rounded corners</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="hide-drag-points" checked={hideDragPoints} onCheckedChange={onToggleHideDragPoints} />
            <Label htmlFor="hide-drag-points">Hide drag points</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="corner-radius">Corner Radius: {cornerRadius}px</Label>
            <Slider
              id="corner-radius"
              min={1}
              max={50}
              step={1}
              value={[cornerRadius]}
              onValueChange={(value) => onCornerRadiusChange(value[0])}
            />
          </div>
          <Button onClick={onReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Shape
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Generated CSS</h3>
        <div className="flex items-center space-x-2">
          <Input type="text" value={`clip-path: ${clipPath};`} readOnly className="flex-1" />
          <Button onClick={copyToClipboard} variant="outline">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">How to use</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Drag the circles to adjust the shape</li>
          <li>Right-click on the shape to add new points</li>
          <li>Toggle rounded corners on/off</li>
          <li>Adjust corner radius with the slider</li>
          <li>Hide drag points for preview</li>
          <li>Reset shape to default square</li>
          <li>Copy the generated CSS</li>
          <li>Paste the CSS into your project</li>
        </ol>
      </div>
    </div>
  )
}

