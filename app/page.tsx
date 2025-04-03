"use client"

import type React from "react"

import { useCallback, useState, useEffect } from "react"
import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  Controls,
  type NodeTypes,
  useEdgesState,
  useNodesState,
  Panel,
  type Node,
} from "reactflow"
import "reactflow/dist/style.css"
import { Sidebar } from "@/components/sidebar"
import { FunctionNode } from "@/components/function-node"
import { StartNode } from "@/components/start-node"
import { EndNode } from "@/components/end-node"
import { VariableNode } from "@/components/variable-node"
import { LoopNode } from "@/components/loop-node"
import { ConditionNode } from "@/components/condition-node"
import { CommentNode } from "@/components/comment-node"
import { Button } from "@/components/ui/button"
import { generateLuaCode } from "@/lib/code-generator"
import { CodePreview } from "@/components/code-preview"
import { SaveDialog } from "@/components/save-dialog"
import { LoadDialog } from "@/components/load-dialog"
import { initialNodes } from "@/lib/initial-nodes"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { MiniMap } from "reactflow"
import { ThemeProvider } from "@/components/theme-provider"
import { MessageSquare, GitBranch, Repeat, Keyboard, FileCode, Save, FolderOpen } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const nodeTypes: NodeTypes = {
  functionNode: FunctionNode,
  startNode: StartNode,
  endNode: EndNode,
  variableNode: VariableNode,
  loopNode: LoopNode,
  conditionNode: ConditionNode,
  commentNode: CommentNode,
}

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [showCodePreview, setShowCodePreview] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const { toast } = useToast()
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (!reactFlowInstance) return

      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const data = JSON.parse(event.dataTransfer.getData("application/reactflow"))

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: `${data.type}-${Date.now()}`,
        type: data.type,
        position,
        data: {
          ...data,
          parameters: data.parameters || [],
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  const onSave = (name: string) => {
    try {
      const savedFlows = JSON.parse(localStorage.getItem("savedFlows") || "{}")
      savedFlows[name] = { nodes, edges }
      localStorage.setItem("savedFlows", JSON.stringify(savedFlows))
      setShowSaveDialog(false)
      toast({
        title: "Script saved",
        description: `Your script "${name}" has been saved successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error saving script",
        description: "There was an error saving your script.",
        variant: "destructive",
      })
    }
  }

  const onLoad = (name: string) => {
    try {
      const savedFlows = JSON.parse(localStorage.getItem("savedFlows") || "{}")
      const flow = savedFlows[name]
      if (flow) {
        setNodes(flow.nodes)
        setEdges(flow.edges)
        setShowLoadDialog(false)
        toast({
          title: "Script loaded",
          description: `Script "${name}" loaded successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error loading script",
        description: "There was an error loading your script.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateCode = () => {
    setShowCodePreview(true)
  }

  const addCommentNode = () => {
    const newNode = {
      id: `commentNode-${Date.now()}`,
      type: "commentNode",
      position: { x: 100, y: 200 },
      data: { text: "Add your comment here" },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const addConditionNode = () => {
    const newNode = {
      id: `conditionNode-${Date.now()}`,
      type: "conditionNode",
      position: { x: 100, y: 300 },
      data: { condition: "", trueLabel: "True", falseLabel: "False" },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const addLoopNode = () => {
    const newNode = {
      id: `loopNode-${Date.now()}`,
      type: "loopNode",
      position: { x: 100, y: 400 },
      data: { condition: "API.Read_LoopyLoop()" },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      // Remove the nodes
      setNodes((nds) => nds.filter((node) => !nodesToDelete.some((n) => n.id === node.id)))

      // Remove any edges connected to these nodes
      setEdges((eds) =>
        eds.filter((edge) => !nodesToDelete.some((node) => node.id === edge.source || node.id === edge.target)),
      )

      toast({
        title: "Node deleted",
        description: "The selected node has been removed from the flow.",
      })
    },
    [setNodes, setEdges, toast],
  )

  // Add keyboard shortcuts for node deletion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && document.activeElement === document.body) {
        const selectedNodes = nodes.filter((node) => node.selected)
        if (selectedNodes.length > 0) {
          onNodesDelete(selectedNodes)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [nodes, onNodesDelete])

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex h-screen w-full bg-background">
        <Sidebar setNodes={setNodes} />
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-card">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileCode className="h-6 w-6 text-primary" />
              Lua Visual Scripter
            </h1>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setShowKeyboardShortcuts(true)}>
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Keyboard Shortcuts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setShowLoadDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <FolderOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Load</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Load a saved script</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setShowSaveDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save your script</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button onClick={handleGenerateCode} className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                <span className="hidden sm:inline">Generate Code</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              onNodesDelete={onNodesDelete}
              deleteKeyCode={["Delete", "Backspace"]}
              fitView
              attributionPosition="bottom-right"
              className="bg-dot-pattern"
            >
              <Background color="#aaa" gap={16} />
              <Controls />
              <MiniMap
                nodeStrokeColor={(n) => {
                  if (n.type === "startNode") return "#0041d0"
                  if (n.type === "endNode") return "#ff0072"
                  if (n.type === "loopNode") return "#1a192b"
                  return "#eee"
                }}
                nodeColor={(n) => {
                  if (n.type === "startNode") return "#d0e1ff"
                  if (n.type === "endNode") return "#ffcce3"
                  if (n.type === "loopNode") return "#e6e6e6"
                  return "#fff"
                }}
              />
              <Panel position="top-right" className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" onClick={addCommentNode} className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Comment</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a comment node</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" onClick={addConditionNode} className="flex items-center gap-1">
                        <GitBranch className="h-4 w-4" />
                        <span className="hidden sm:inline">Condition</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a condition node</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" onClick={addLoopNode} className="flex items-center gap-1">
                        <Repeat className="h-4 w-4" />
                        <span className="hidden sm:inline">Loop</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a loop node</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Panel>
            </ReactFlow>
          </div>
        </div>

        {showCodePreview && (
          <CodePreview code={generateLuaCode(nodes, edges)} onClose={() => setShowCodePreview(false)} />
        )}

        {showSaveDialog && <SaveDialog onSave={onSave} onCancel={() => setShowSaveDialog(false)} />}

        {showLoadDialog && <LoadDialog onLoad={onLoad} onCancel={() => setShowLoadDialog(false)} />}

        <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </DialogTitle>
              <DialogDescription>Use these shortcuts to work more efficiently</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <h3 className="font-medium mb-2">Node Operations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Delete selected node</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Delete</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Select multiple nodes</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift + Click</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Copy selected nodes</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + C</kbd>
                  </li>
                </ul>
              </div>
              <div className="border rounded-md p-3">
                <h3 className="font-medium mb-2">Canvas Navigation</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Pan canvas</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Mouse Drag</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Zoom in/out</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Mouse Wheel</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Fit view to content</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + 0</kbd>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tip: Hover over a node to see the delete button. You can also select a node and press Delete.
            </div>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </ThemeProvider>
  )
}

