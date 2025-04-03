"use client"

import type React from "react"

import { useState } from "react"
import type { Node } from "reactflow"
import { apiCategories } from "@/lib/api-categories"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Variable, FileCode } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { getParameterInfo } from "@/lib/parameter-info"

interface SidebarProps {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
}

export function Sidebar({ setNodes }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    functionName: string,
    category: string,
  ) => {
    // Get parameter info for this function
    const paramInfo = getParameterInfo(functionName)

    // Create default parameters based on the parameter info
    const parameters = paramInfo?.params
      ? paramInfo.params.map((param) => ({
          name: param.name,
          value: "",
          type: param.type,
          required: param.required || false,
          description: param.description || "",
        }))
      : []

    const data = {
      type: nodeType,
      functionName,
      category,
      parameters,
      description: paramInfo?.description || "",
      returns: paramInfo?.returns || null,
    }

    event.dataTransfer.setData("application/reactflow", JSON.stringify(data))
    event.dataTransfer.effectAllowed = "move"
  }

  const addVariableNode = () => {
    setNodes((nds) => [
      ...nds,
      {
        id: `variable-${Date.now()}`,
        type: "variableNode",
        position: { x: 250, y: 250 },
        data: { name: "newVariable", value: "", type: "string" },
      },
    ])
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const filteredCategories = Object.entries(apiCategories).map(([category, functions]) => {
    const filteredFunctions = functions.filter((fn) => fn.toLowerCase().includes(searchTerm.toLowerCase()))
    return { category, functions: filteredFunctions }
  })

  // Count total functions for display
  const totalFunctions = Object.values(apiCategories).reduce((acc, functions) => acc + functions.length, 0)

  return (
    <div className="w-72 border-r bg-card flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <FileCode className="h-5 w-5 text-primary" />
          Function Library
        </h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search functions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {searchTerm ? (
            <span>Showing functions matching "{searchTerm}"</span>
          ) : (
            <span>{totalFunctions} functions available</span>
          )}
        </div>
      </div>
      <div className="p-4 border-b">
        <h3 className="font-medium mb-2">Basic Nodes</h3>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="justify-start gap-2" onClick={addVariableNode}>
            <Variable className="h-4 w-4" />
            Add Variable
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          <Accordion type="multiple" className="w-full">
            {filteredCategories.map(
              ({ category, functions }) =>
                functions.length > 0 && (
                  <AccordionItem value={category} key={category}>
                    <AccordionTrigger
                      className="px-2 py-2 hover:bg-accent hover:text-accent-foreground rounded-md"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center gap-2">
                        {category}
                        <Badge variant="outline" className="ml-2">
                          {functions.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-1 pl-2">
                        {functions.map((fn) => {
                          const paramInfo = getParameterInfo(fn)
                          const paramCount = paramInfo?.params?.length || 0

                          return (
                            <div
                              key={fn}
                              className="px-3 py-2 border rounded-md cursor-grab bg-background hover:bg-accent hover:text-accent-foreground text-sm transition-colors"
                              draggable
                              onDragStart={(event) => onDragStart(event, "functionNode", fn, category)}
                            >
                              <div className="font-medium flex items-center justify-between">
                                <span>{fn}</span>
                                {paramCount > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {paramCount} param{paramCount !== 1 ? "s" : ""}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {paramInfo?.description ? (
                                  <span className="line-clamp-1">{paramInfo.description}</span>
                                ) : (
                                  category
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ),
            )}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

