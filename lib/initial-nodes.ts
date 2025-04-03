import type { Node } from "reactflow"

export const initialNodes: Node[] = [
  {
    id: "start",
    type: "startNode",
    position: { x: 100, y: 100 },
    data: {},
  },
  {
    id: "loop",
    type: "loopNode",
    position: { x: 300, y: 100 },
    data: { condition: "API.Read_LoopyLoop()" },
  },
  {
    id: "end",
    type: "endNode",
    position: { x: 500, y: 100 },
    data: {},
  },
]

