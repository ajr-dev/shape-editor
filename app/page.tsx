import { ShapeEditor } from "@/components/shape-editor"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ShapeEditor />
    </ThemeProvider>
  )
}

