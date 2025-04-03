"use client"

import { Button } from "@/components/ui/button"
import { X, Copy, Check, Download } from "lucide-react"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CodePreviewProps {
  code: string
  onClose: () => void
}

export function CodePreview({ code, onClose }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "script.lua"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-lg w-[800px] max-w-[90vw] max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Generated Lua Code</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleCopy} className="h-8 w-8" title="Copy to clipboard">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              className="h-8 w-8"
              title="Download as .lua file"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onClose} className="h-8 w-8" title="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <pre className="text-sm font-mono bg-muted p-4 rounded-md overflow-auto">{code}</pre>
        </ScrollArea>
        <div className="p-4 border-t flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

