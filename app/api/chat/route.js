import servers from "../../../public/servers.json"; // Import the JSON data

export async function POST(req) {
  const { messages } = await req.json();
  // Use the last message from the user (or adjust as needed)
  const userMessage = messages[messages.length - 1]?.content || "";
  const lowerCaseMsg = userMessage.toLowerCase();

  let reply = "";

  // Check if the user is asking to make a project.
  const isProjectRequest = lowerCaseMsg.includes("create project") || lowerCaseMsg.includes("make a project");

  if (isProjectRequest) {
    // Find a server that has the project_creation capability.
    const projectServer = servers.find(server =>
      server.capabilities.includes("project_creation")
    );
  
    if (projectServer) {
      // Simulate project creation by returning a message.
      reply = `🚀 Project creation initiated on ${projectServer.name}! Please provide further details to customize your project.`;
    } else {
      reply = "🤖 Sorry, there is no server available for project creation at this time.";
    }
  } else {
    // For normal queries, match by category.
    const matchedServer = servers.find(server =>
      lowerCaseMsg.includes(server.category.toLowerCase())
    );
  
    if (matchedServer) {
      reply = `✅ Best server for ${matchedServer.category}: ${matchedServer.name}`;
    } else {
      reply = "🤖 Sorry, I could not find a matching MCP server. Please try a different query!";
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(reply));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" }
  });
}
