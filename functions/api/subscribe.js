export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const data = await request.json();
    
    // Save to D1
    await env.DB.prepare(
      "INSERT INTO subscribers (email, country, interests) VALUES (?, ?, ?)"
    ).bind(data.email, data.country, data.interests).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    // Handle duplicate emails
    if (err.message.includes("UNIQUE constraint")) {
        return new Response("Already subscribed!", { status: 400 });
    }
    return new Response(err.message, { status: 500 });
  }
}
