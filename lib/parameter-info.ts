interface ParamInfo {
  name: string
  type: string
  description?: string
  required?: boolean
}

interface FunctionInfo {
  description?: string
  params?: ParamInfo[]
  returns?: {
    type: string
    description?: string
  }
}

const parameterInfoMap: Record<string, FunctionInfo> = {
  // Player Actions
  DoAction_Tile: {
    description: "Clicks on a specific tile on the game map",
    params: [{ name: "normal_tile", type: "WPOINT", description: "Coordinates of the tile to click", required: true }],
    returns: { type: "boolean", description: "True if action was successful" },
  },
  DoAction_WalkerF: {
    description: "Makes the player walk to a specific location using float coordinates",
    params: [
      { name: "normal_tile", type: "FFPOINT", description: "Float coordinates of the destination", required: true },
    ],
    returns: { type: "boolean", description: "True if action was successful" },
  },
  DoAction_WalkerW: {
    description: "Makes the player walk to a specific location using integer coordinates",
    params: [
      { name: "normal_tile", type: "WPOINT", description: "Integer coordinates of the destination", required: true },
    ],
    returns: { type: "boolean", description: "True if action was successful" },
  },
  DoAction_Surge_Tile: {
    description: "Makes the player use the Surge ability to a specific tile",
    params: [
      { name: "normal_tile", type: "WPOINT", description: "Coordinates of the destination", required: true },
      { name: "errorrange", type: "number", description: "Error range (0-1)", required: true },
    ],
    returns: { type: "boolean", description: "True if action was successful" },
  },

  // NPC Interaction
  DoAction_NPC: {
    description: "Performs an action on an NPC",
    params: [
      { name: "action", type: "number", description: "Action ID to perform", required: true },
      { name: "offset", type: "number", description: "Offset value", required: true },
      { name: "objects", type: "table|number", description: "NPC ID(s) to interact with", required: true },
      { name: "maxdistance", type: "number", description: "Maximum distance to search for NPCs", required: true },
      { name: "ignore_star", type: "boolean", description: "Whether to ignore starred NPCs", required: false },
      { name: "health", type: "number", description: "Minimum health threshold", required: false },
    ],
    returns: { type: "boolean", description: "True if action was successful" },
  },
  FindNPCbyName: {
    description: "Finds an NPC by name within a specified distance",
    params: [
      { name: "NPC_name", type: "string", description: "Name of the NPC to find", required: true },
      { name: "maxdistance", type: "number", description: "Maximum distance to search", required: true },
    ],
    returns: { type: "table|AllObject", description: "NPC object if found" },
  },

  // Object Interaction
  DoAction_Object: {
    description: "Performs an action on a game object",
    params: [
      { name: "action", type: "number", description: "Action ID to perform", required: true },
      { name: "offset", type: "number", description: "Offset value", required: true },
      { name: "obj", type: "table|number", description: "Object ID(s) to interact with", required: true },
      { name: "maxdistance", type: "number", description: "Maximum distance to search for objects", required: true },
      { name: "tile", type: "WPOINT", description: "Specific tile to search around", required: false },
    ],
    returns: { type: "boolean", description: "True if action was successful" },
  },

  // Inventory & Bank
  BankOpen2: {
    description: "Opens the bank interface",
    returns: { type: "boolean", description: "True if bank was successfully opened" },
  },
  BankClose: {
    description: "Closes the bank interface",
    returns: { type: "void" },
  },
  BankAllItems: {
    description: "Deposits all items from inventory to bank",
    returns: { type: "boolean", description: "True if all items were successfully deposited" },
  },
  InvFull_: {
    description: "Checks if the inventory is full",
    returns: { type: "boolean", description: "True if inventory is full" },
  },
  Invfreecount_: {
    description: "Gets the number of free inventory slots",
    returns: { type: "number", description: "Number of free inventory slots" },
  },

  // Combat & Abilities
  DoAction_Ability: {
    description: "Activates an ability by name",
    params: [
      { name: "name", type: "string", description: "Name of the ability to activate", required: true },
      { name: "m_action", type: "number", description: "Action ID", required: true },
      { name: "offset", type: "number", description: "Offset value", required: true },
      { name: "exact_match", type: "boolean", description: "Whether to require exact name match", required: true },
    ],
    returns: { type: "boolean", description: "True if ability was successfully activated" },
  },
  GetHP_: {
    description: "Gets the current health points of the player",
    returns: { type: "number", description: "Current health points" },
  },
  GetHPMax_: {
    description: "Gets the maximum health points of the player",
    returns: { type: "number", description: "Maximum health points" },
  },

  // Player Information
  GetLocalPlayerName: {
    description: "Gets the name of the local player",
    returns: { type: "string", description: "Name of the local player" },
  },
  PlayerCoord: {
    description: "Gets the current coordinates of the player",
    returns: { type: "WPOINT", description: "Current player coordinates" },
  },

  // UI & Interface
  LootWindowOpen_2: {
    description: "Checks if the loot window is open",
    returns: { type: "boolean", description: "True if loot window is open" },
  },
  LootWindow_Loot: {
    description: "Loots items from the loot window",
    params: [
      { name: "Except_itemv", type: "table|number", description: "Items to exclude from looting", required: true },
    ],
    returns: { type: "boolean", description: "True if looting was successful" },
  },

  // Dialog & Chat
  DoContinue_Dialog: {
    description: "Clicks the continue button in a dialog",
    returns: { type: "boolean", description: "True if continue was clicked successfully" },
  },
  DoDialog_Option: {
    description: "Selects a dialog option by text",
    params: [{ name: "text", type: "string", description: "Text of the option to select", required: true }],
    returns: { type: "boolean", description: "True if option was selected successfully" },
  },

  // Math & Calculations
  Math_RandomNumber: {
    description: "Generates a random number up to the specified maximum",
    params: [
      { name: "numbersize", type: "number", description: "Maximum value for the random number", required: true },
    ],
    returns: { type: "number", description: "Random number generated" },
  },

  // Mouse & Keyboard
  MouseLeftClick: {
    description: "Performs a left mouse click",
    params: [
      { name: "sleep", type: "number", description: "Sleep time after click", required: true },
      { name: "rand", type: "number", description: "Random variation in sleep time", required: true },
    ],
    returns: { type: "void" },
  },
  MouseRightClick: {
    description: "Performs a right mouse click",
    params: [
      { name: "sleep", type: "number", description: "Sleep time after click", required: true },
      { name: "rand", type: "number", description: "Random variation in sleep time", required: true },
    ],
    returns: { type: "void" },
  },

  // Utility
  Sleep_tick: {
    description: "Sleeps for a specified number of game ticks (approximately 600ms per tick)",
    params: [{ name: "count", type: "number", description: "Number of ticks to sleep", required: true }],
    returns: { type: "boolean" },
  },
  RandomSleep: {
    description: "Sleeps for a random amount of time",
    returns: { type: "void" },
  },
  Read_LoopyLoop: {
    description: "Checks if the script should continue running",
    returns: { type: "boolean", description: "True if the script should continue running" },
  },
  Write_LoopyLoop: {
    description: "Sets whether the script should continue running",
    params: [
      { name: "bools", type: "boolean", description: "Whether the script should continue running", required: true },
    ],
    returns: { type: "void" },
  },
  ReadAllObjectsArray: {
    description: "Reads all objects in the game world",
    params: [
      { name: "types", type: "table", description: "Types of objects to read", required: true },
      { name: "ids", type: "table", description: "IDs of objects to read", required: true },
      { name: "names", type: "table", description: "Names of objects to read", required: true },
    ],
    returns: { type: "table", description: "Array of objects" },
  },
  DoRandomEvents: {
    description: "Handles random events that may occur during gameplay",
    returns: { type: "boolean", description: "True if a random event was handled" },
  },
  WaitUntilMovingEnds: {
    description: "Waits until the player stops moving",
    params: [
      { name: "timeout", type: "number", description: "Maximum time to wait in seconds", required: true },
      { name: "sleepticks", type: "number", description: "Sleep ticks between checks", required: true },
    ],
    returns: { type: "boolean", description: "True if player stopped moving before timeout" },
  },
  RandomSleep2: {
    description: "Sleeps for a random amount of time within a range",
    params: [
      { name: "min", type: "number", description: "Minimum sleep time in milliseconds", required: true },
      { name: "max", type: "number", description: "Maximum sleep time in milliseconds", required: true },
      { name: "deviation", type: "number", description: "Deviation factor", required: true },
    ],
    returns: { type: "void" },
  },
  Dist_FLP: {
    description: "Calculates distance from local player to a point",
    params: [{ name: "point", type: "FFPOINT", description: "Destination point", required: true }],
    returns: { type: "number", description: "Distance in game units" },
  },
  VB_FindPSett: {
    description: "Finds a player setting by ID",
    params: [{ name: "settingId", type: "number", description: "ID of the setting to find", required: true }],
    returns: { type: "SettingInfo", description: "Setting information including state and value" },
  },
  SystemTime: {
    description: "Gets the current system time in milliseconds",
    returns: { type: "number", description: "Current system time in milliseconds" },
  },
  GetHPrecent: {
    description: "Gets the current health percentage of the player",
    returns: { type: "number", description: "Current health percentage (0-100)" },
  },
  JsonEncode: {
    description: "Encodes a Lua table into a JSON string",
    params: [{ name: "table", type: "table", description: "Table to encode", required: true }],
    returns: { type: "string", description: "JSON string representation" },
  },
  JsonDecode: {
    description: "Decodes a JSON string into a Lua table",
    params: [{ name: "json", type: "string", description: "JSON string to decode", required: true }],
    returns: { type: "table", description: "Lua table representation" },
  },
  GatherEvents_chat_check: {
    description: "Checks for chat events",
    returns: { type: "EventData", description: "Chat event data" },
  },
}

export function getParameterInfo(functionName: string): FunctionInfo | null {
  return parameterInfoMap[functionName] || null
}

