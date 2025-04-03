"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"

export function CommentNode({ data, id }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleTextChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      data.text = evt.target.value
    },
    [data],
  )

  return (
    <div
      className="rounded-md border bg-yellow-50 p-4 shadow-md w-[250px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="node-delete-button cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            // The actual deletion is handled by ReactFlow's onNodesDelete
          }}
        >
          <Trash2 className="h-3 w-3" />
        </div>
      )}
      <div className="font-medium text-yellow-800 mb-2">Comment</div>
      <Textarea
        value={data.text || ""}
        onChange={handleTextChange}
        className="min-h-[100px] bg-white border-yellow-200"
        placeholder="Add your comment here..."
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-yellow-50"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-yellow-50"
      />
    </div>
  )
}

