"use client"

import { useCallback, useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { X, ChevronDown, ChevronUp, Info, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { getParameterInfo } from "@/lib/parameter-info"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function FunctionNode({ data, id }: NodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [parameters, setParameters] = useState<{ name: string; value: string }[]>(data.parameters || [])
  const [isHovered, setIsHovered] = useState(false)

  const paramInfo = getParameterInfo(data.functionName)

  const handleParameterChange = useCallback(
    (index: number, value: string) => {
      const newParameters = [...parameters]
      newParameters[index].value = value
      setParameters(newParameters)
      data.parameters = newParameters
    },
    [parameters, data],
  )

  const handleAddParameter = useCallback(() => {
    const newParameters = [...parameters, { name: `param${parameters.length + 1}`, value: "" }]
    setParameters(newParameters)
    data.parameters = newParameters
  }, [parameters, data])

  const handleRemoveParameter = useCallback(
    (index: number) => {
      const newParameters = parameters.filter((_, i) => i !== index)
      setParameters(newParameters)
      data.parameters = newParameters
    },
    [parameters, data],
  )

  return (
    <div
      className="rounded-md border bg-card shadow-sm w-[320px]"
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
      <div className="bg-primary/10 p-3 border-b flex items-center justify-between">
        <div className="font-medium text-foreground">{data.functionName}</div>
        <div className="flex items-center gap-1">
          {paramInfo && paramInfo.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{paramInfo.description}</p>
                  {paramInfo.returns && (
                    <p className="mt-2 text-xs">
                      Returns: <Badge variant="outline">{paramInfo.returns.type}</Badge>
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-3 space-y-3">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5">
              {data.category}
            </Badge>
          </div>

          {paramInfo && paramInfo.params && paramInfo.params.length > 0 ? (
            <div className="space-y-3">
              {paramInfo.params.map((param, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs flex items-center gap-1">
                      {param.name}
                      {param.required && <span className="text-destructive">*</span>}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{param.description || param.name}</p>
                            <p className="text-xs mt-1">Type: {param.type}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {param.type}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={parameters[index]?.value || ""}
                      onChange={(e) => handleParameterChange(index, e.target.value)}
                      placeholder={param.description || param.name}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {parameters.map((param, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={param.value}
                    onChange={(e) => handleParameterChange(index, e.target.value)}
                    placeholder={`Parameter ${index + 1}`}
                    className="h-8 text-sm"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveParameter(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" onClick={handleAddParameter}>
                Add Parameter
              </Button>
            </div>
          )}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="w-3 h-3 rounded-full bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="w-3 h-3 rounded-full bg-primary border-2 border-background"
      />
    </div>
  )
}

