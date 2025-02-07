"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Check, Copy, RotateCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ControlPanelProps {
  isRounded: boolean
  onToggleRounded: () => void
  hideDragPoints: boolean
  onToggleHideDragPoints: () => void
  cornerRadius: number
  onCornerRadiusChange: (value: number) => void
  clipPath: string
  onReset: () => void
  snapToGrid: boolean
  onToggleSnapToGrid: () => void
}

export function ControlPanel({
  isRounded,
  onToggleRounded,
  hideDragPoints,
  onToggleHideDragPoints,
  cornerRadius,
  onCornerRadiusChange,
  clipPath,
  onReset,
  snapToGrid,
  onToggleSnapToGrid,
}: ControlPanelProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`clip-path: ${clipPath};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Options</CardTitle>
          <CardDescription>Customize the shape appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="rounded-corners">Rounded corners</Label>
            <Switch id="rounded-corners" checked={isRounded} onCheckedChange={onToggleRounded} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="hide-drag-points">Hide drag points</Label>
            <Switch id="hide-drag-points" checked={hideDragPoints} onCheckedChange={onToggleHideDragPoints} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="snap-to-grid">Snap to grid</Label>
            <Switch id="snap-to-grid" checked={snapToGrid} onCheckedChange={onToggleSnapToGrid} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="corner-radius">Corner Radius</Label>
              <span className="text-sm text-muted-foreground">{cornerRadius}px</span>
            </div>
            <Slider
              id="corner-radius"
              min={1}
              max={50}
              step={1}
              value={[cornerRadius]}
              onValueChange={(value) => onCornerRadiusChange(value[0])}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
          </div>
          <Button onClick={onReset} variant="outline" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Shape
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated CSS</CardTitle>
          <CardDescription>Copy and paste into your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex space-x-2">
            <Input value={`clip-path: ${clipPath};`} readOnly />
            <Button onClick={copyToClipboard} variant="outline" size="icon">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to use</CardTitle>
          <CardDescription>Quick guide to shape editing</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>• Drag the circles to adjust the shape</li>
            <li>• Right-click on the shape to add new points</li>
            <li>• Toggle rounded corners on/off</li>
            <li>• Adjust corner radius with the slider</li>
            <li>• Hide drag points for preview</li>
            <li>• Toggle snap to grid for precise alignment</li>
            <li>• Reset shape to default square</li>
            <li>• Copy the generated CSS</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}