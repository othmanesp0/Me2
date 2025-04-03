"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

export function LoopNode({ data, id }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleConditionChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      data.condition = evt.target.value
    },
    [data],
  )

  return (
    <div
      className="rounded-md border bg-amber-50 p-4 shadow-md w-[300px]"
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
      <div className="font-medium text-amber-800">Loop</div>
      <div className="mt-3">
        <Label className="text-xs text-amber-700">Condition</Label>
        <Input
          value={data.condition || "API.Read_LoopyLoop()"}
          onChange={handleConditionChange}
          className="h-8 text-sm mt-1 bg-white"
          placeholder="Loop condition"
        />
      </div>
      <div className="text-xs text-amber-700 mt-2">
        Code inside this loop will execute repeatedly while the condition is true
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="w-3 h-3 rounded-full bg-amber-500 border-2 border-amber-50"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="w-3 h-3 rounded-full bg-amber-500 border-2 border-amber-50"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="loop-body"
        className="w-3 h-3 rounded-full bg-amber-500 border-2 border-amber-50"
      />
    </div>
  )
}

