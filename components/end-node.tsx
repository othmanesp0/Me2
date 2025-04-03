"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import { useState } from "react"
import { Trash2 } from "lucide-react"

export function EndNode({ data }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="rounded-md border bg-red-100 p-4 shadow-md"
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
      <div className="font-medium text-red-800">End Script</div>
      <div className="text-xs text-red-700 mt-1">Exit point for your Lua script</div>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-100"
      />
    </div>
  )
}

