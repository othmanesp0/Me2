"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LoadDialogProps {
  onLoad: (name: string) => void
  onCancel: () => void
}

export function LoadDialog({ onLoad, onCancel }: LoadDialogProps) {
  const [savedScripts, setSavedScripts] = useState<string[]>([])
  const [selectedScript, setSelectedScript] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [scriptToDelete, setScriptToDelete] = useState<string | null>(null)

  useEffect(() => {
    try {
      const savedFlows = JSON.parse(localStorage.getItem("savedFlows") || "{}")
      setSavedScripts(Object.keys(savedFlows))
    } catch (error) {
      console.error("Error loading saved scripts:", error)
      setSavedScripts([])
    }
  }, [])

  const handleLoad = () => {
    if (selectedScript) {
      onLoad(selectedScript)
    }
  }

  const handleDelete = (script: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setScriptToDelete(script)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (scriptToDelete) {
      try {
        const savedFlows = JSON.parse(localStorage.getItem("savedFlows") || "{}")
        delete savedFlows[scriptToDelete]
        localStorage.setItem("savedFlows", JSON.stringify(savedFlows))
        setSavedScripts(Object.keys(savedFlows))
        if (selectedScript === scriptToDelete) {
          setSelectedScript(null)
        }
      } catch (error) {
        console.error("Error deleting script:", error)
      }
    }
    setShowDeleteConfirm(false)
    setScriptToDelete(null)
  }

  const filteredScripts = savedScripts.filter((script) => script.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-lg w-[500px] max-w-[90vw]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Load Script</h2>
          <Button variant="outline" size="icon" onClick={onCancel} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scripts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredScripts.length > 0 ? (
            <ScrollArea className="h-[300px] border rounded-md">
              {filteredScripts.map((script) => (
                <div
                  key={script}
                  className={`p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground flex justify-between items-center ${
                    selectedScript === script ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={() => setSelectedScript(script)}
                >
                  <span className="truncate">{script}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-70 hover:opacity-100"
                    onClick={(e) => handleDelete(script, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-md">
              {searchTerm ? "No matching scripts found" : "No saved scripts found"}
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleLoad} disabled={!selectedScript || filteredScripts.length === 0}>
            Load
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the script "{scriptToDelete}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

