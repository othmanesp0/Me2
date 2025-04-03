"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface SaveDialogProps {
  onSave: (name: string) => void
  onCancel: () => void
}

export function SaveDialog({ onSave, onCancel }: SaveDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-lg w-[450px] max-w-[90vw]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Save Script</h2>
          <Button variant="outline" size="icon" onClick={onCancel} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="script-name">Script Name</Label>
              <Input
                id="script-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your script"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="script-description">Description (optional)</Label>
              <Textarea
                id="script-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a brief description of what your script does"
                rows={3}
              />
            </div>
          </div>
          <div className="p-4 border-t flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

