"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

export function ConditionNode({ data, id }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleConditionChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      data.condition = evt.target.value
    },
    [data],
  )

  const handleTrueLabelChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      data.trueLabel = evt.target.value
    },
    [data],
  )

  const handleFalseLabelChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      data.falseLabel = evt.target.value
    },
    [data],
  )

  return (
    <div
      className="rounded-md border bg-blue-50 p-4 shadow-md w-[300px]"
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
      <div className="font-medium text-blue-800">Condition</div>
      <div className="mt-3">
        <Label className="text-xs text-blue-700">If</Label>
        <Input
          value={data.condition || ""}
          onChange={handleConditionChange}
          className="h-8 text-sm mt-1 bg-white"
          placeholder="Condition expression"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div>
          <Label className="text-xs text-blue-700">True Label</Label>
          <Input
            value={data.trueLabel || "True"}
            onChange={handleTrueLabelChange}
            className="h-8 text-sm mt-1 bg-white"
          />
        </div>
        <div>
          <Label className="text-xs text-blue-700">False Label</Label>
          <Input
            value={data.falseLabel || "False"}
            onChange={handleFalseLabelChange}
            className="h-8 text-sm mt-1 bg-white"
          />
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-50"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 rounded-full bg-green-500 border-2 border-blue-50"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 rounded-full bg-red-500 border-2 border-blue-50"
      />
    </div>
  )
}

