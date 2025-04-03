import type { Edge, Node } from "reactflow"

export function generateLuaCode(nodes: Node[], edges: Edge[]): string {
  let code = 'local API = require("api")\n\n'

  // Add variables
  const variableNodes = nodes.filter((node) => node.type === "variableNode")
  if (variableNodes.length > 0) {
    code += "-- Variables\n"
    variableNodes.forEach((node) => {
      const { name, value, type } = node.data
      // Handle different value types (string, number, boolean)
      let formattedValue = value
      if (type === "number" || (!type && !isNaN(Number(value)))) {
        formattedValue = value // It's a number
      } else if (type === "boolean" || (!type && (value.toLowerCase() === "true" || value.toLowerCase() === "false"))) {
        formattedValue = value.toLowerCase() // It's a boolean
      } else if (type === "table" && value.startsWith("{") && value.endsWith("}")) {
        formattedValue = value // It's a table literal
      } else {
        formattedValue = `"${value}"` // It's a string
      }

      code += `local ${name} = ${formattedValue}\n`
    })
    code += "\n"
  }

  // Add comments
  const commentNodes = nodes.filter((node) => node.type === "commentNode")
  if (commentNodes.length > 0) {
    code += "-- Comments\n"
    commentNodes.forEach((node) => {
      const { text } = node.data
      const commentLines = text.split("\n")
      commentLines.forEach((line) => {
        code += `-- ${line}\n`
      })
    })
    code += "\n"
  }

  // Find the start node
  const startNode = nodes.find((node) => node.type === "startNode")
  if (!startNode) {
    return code + "-- Error: No start node found in the flow"
  }

  // Build a map of node connections
  const nodeConnections: Record<string, string[]> = {}
  edges.forEach((edge) => {
    if (!nodeConnections[edge.source]) {
      nodeConnections[edge.source] = []
    }
    nodeConnections[edge.source].push(edge.target)
  })

  // Find loop nodes
  const loopNodes = nodes.filter((node) => node.type === "loopNode")

  // Generate the main script
  code += "-- Main Script\n"

  // Add main loop if there are loop nodes
  if (loopNodes.length > 0) {
    const mainLoop = loopNodes[0]
    code += `while (${mainLoop.data.condition || "API.Read_LoopyLoop()"}) do\n`

    // Process nodes inside the loop
    const loopBody = nodeConnections[mainLoop.id] || []
    loopBody.forEach((nodeId) => {
      code += processNode(nodeId, "  ", nodes, nodeConnections, edges)
    })

    code += "end\n"
  } else {
    // If no loop nodes, just process from the start
    const connectedToStart = nodeConnections[startNode.id] || []
    connectedToStart.forEach((nodeId) => {
      code += processNode(nodeId, "", nodes, nodeConnections, edges)
    })
  }

  return code
}

// Function to recursively process nodes
function processNode(
  nodeId: string,
  indent = "",
  nodes: Node[],
  nodeConnections: Record<string, string[]>,
  edges: Edge[],
): string {
  const node = nodes.find((n) => n.id === nodeId)
  if (!node) return ""

  let nodeCode = ""

  if (node.type === "functionNode") {
    const { functionName, parameters } = node.data

    // Format parameters
    const formattedParams = parameters
      .map((param: { value: string }) => {
        if (!isNaN(Number(param.value))) {
          return param.value // It's a number
        } else if (param.value.toLowerCase() === "true" || param.value.toLowerCase() === "false") {
          return param.value.toLowerCase() // It's a boolean
        } else if (param.value.startsWith("{") && param.value.endsWith("}")) {
          return param.value // It's a table literal
        } else {
          return `"${param.value}"` // It's a string
        }
      })
      .join(", ")

    // Generate function call
    nodeCode += `${indent}API.${functionName}(${formattedParams})\n`

    // Process connected nodes
    const connectedNodes = nodeConnections[node.id] || []
    connectedNodes.forEach((connectedNodeId) => {
      nodeCode += processNode(connectedNodeId, indent, nodes, nodeConnections, edges)
    })
  } else if (node.type === "conditionNode") {
    const { condition, trueLabel, falseLabel } = node.data

    nodeCode += `${indent}if (${condition}) then\n`

    // Process true branch
    const connectedNodes = nodeConnections[node.id] || []
    const trueNode = connectedNodes.find((id) => {
      const edge = edges.find((e) => e.source === node.id && e.target === id && e.sourceHandle === "true")
      return !!edge
    })

    if (trueNode) {
      nodeCode += processNode(trueNode, `${indent}  `, nodes, nodeConnections, edges)
    }

    // Process false branch
    const falseNode = connectedNodes.find((id) => {
      const edge = edges.find((e) => e.source === node.id && e.target === id && e.sourceHandle === "false")
      return !!edge
    })

    if (falseNode) {
      nodeCode += `${indent}else\n`
      nodeCode += processNode(falseNode, `${indent}  `, nodes, nodeConnections, edges)
    }

    nodeCode += `${indent}end\n`
  } else if (node.type === "loopNode") {
    // Loop nodes are handled at the top level
  } else if (node.type === "commentNode") {
    // Comments are added at the beginning
  } else if (node.type === "endNode") {
    nodeCode += `${indent}-- End of script\n`
  }

  return nodeCode
}

