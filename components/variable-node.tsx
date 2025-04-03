"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

export function VariableNode({ data, id }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleNameChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      data.name = evt.target.value
    },
    [data],
  )

  const handleValueChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      data.value = evt.target.value
    },
    [data],
  )

  const handleTypeChange = useCallback(
    (value: string) => {
      data.type = value
    },
    [data],
  )

  return (
    <div
      className="rounded-md border bg-card shadow-md p-4 w-[250px]"
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
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Variable Name</Label>
          <Input
            value={data.name || ""}
            onChange={handleNameChange}
            className="h-8 text-sm mt-1"
            placeholder="myVariable"
          />
        </div>
        <div>
          <Label className="text-xs">Type</Label>
          <Select onValueChange={handleTypeChange} defaultValue={data.type || "string"}>
            <SelectTrigger className="h-8 text-sm mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="function">Function</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Default Value</Label>
          <Input
            value={data.value || ""}
            onChange={handleValueChange}
            className="h-8 text-sm mt-1"
            placeholder="Initial value"
          />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="w-3 h-3 rounded-full bg-blue-500 border-2 border-background"
      />
    </div>
  )
}

