"use client"

import { Handle, Position, type NodeProps } from "reactflow"

export function OutputNode({ data }: NodeProps) {
  return (
    <div className="rounded-md border bg-red-100 p-3 shadow-sm">
      <div className="font-medium">End</div>
      <Handle type="target" position={Position.Left} id="in" className="w-2 h-2 rounded-full bg-red-500" />
    </div>
  )
}

