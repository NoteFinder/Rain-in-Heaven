export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const data = await request.json();
    
    // Check if DB is actually bound
    if (!env.DB) {
      return new Response("Database binding 'DB' not found.", { status: 500 });
    }

    await env.DB.prepare(
      "INSERT INTO subscribers (email, country) VALUES (?, ?)"
    ).bind(data.email, data.country).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    // This sends the specific error (like "no such table") to your console
    return new Response(err.message, { status: 500 });
  }
}
