import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"; // Import this

let client = null;

export async function getMCPClient() {
  if (client) return client;

  // Define the transport correctly using the SDK's helper
  const transport = new StdioClientTransport({
    command: "mcp",
    args: ["run", "C:/Users/HP/Desktop/Hisaab.ai/mcp-server/server.py"],
    env: {
      ...process.env,
      UNSTRACT_API_KEY: process.env.UNSTRACT_API_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
  });

  client = new Client(
    { name: "express-backend", version: "1.0.0" },
    { capabilities: {}, requestTimeout: 300000 }
  );

  // Connect using the transport instance
  await client.connect(transport);

  console.log("MCP connected from Express");
  return client;
}
