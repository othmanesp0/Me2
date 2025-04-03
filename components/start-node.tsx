"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import { useState } from "react"
import { Trash2 } from "lucide-react"

export function StartNode({ data }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="rounded-md border bg-green-100 p-4 shadow-md"
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
      <div className="font-medium text-green-800">Start Script</div>
      <div className="text-xs text-green-700 mt-1">Entry point for your Lua script</div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-100"
      />
    </div>
  )
}

