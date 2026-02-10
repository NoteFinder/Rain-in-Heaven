export async function onRequestPost(context) {
  const { env, request } = context;
  const { name, description, image, link } = await request.json();

  try {
    await env.DB.prepare(
      "INSERT INTO themes (name, description, image, link) VALUES (?, ?, ?, ?)"
    ).bind(name, description, image, link).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
