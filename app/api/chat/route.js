import servers from "../../../public/servers.json"; // correct import

export async function POST(req) {
  const { messages } = await req.json();
  const userMessage = messages[messages.length - 1]?.content || "";

  // find best matching server based on category
  const server = servers.find((server) =>
    userMessage.toLowerCase().includes(server.category.toLowerCase())
  );

  let reply = "";

  if (server) {
    reply = `✅ Best server for ${server.category}: ${server.name}`;
  } else {
    reply = "🤖 Sorry, I could not find a matching MCP server. Please try a different query!";
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(reply));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
