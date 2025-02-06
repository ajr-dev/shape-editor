import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "../theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="container max-w-screen-2xl mx-auto flex h-14 items-center">
            <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
                <span className="font-bold inline-block">Shape Editor</span>
            </a>
            </div>
            <div className="flex flex-1 items-center space-x-2 justify-end">
            <ThemeToggle />
            </div>
        </div>
    </header>
  )
}

