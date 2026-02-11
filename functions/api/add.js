export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const { name, description, image, link, try_link } = await request.json();
    // This requires the "DB" binding in your Settings
    await env.DB.prepare(
      "INSERT INTO themes (name, description, image, link, try_link) VALUES (?, ?, ?, ?, ?)"
    ).bind(name, description, image, link, try_link).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
