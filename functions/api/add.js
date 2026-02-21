// functions/api/add.js
export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const data = await request.json();

    await env.DB.prepare(
      "INSERT INTO themes (name, description, image, try_link, tags, link) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(data.name, data.description, data.image, data.try_link, data.tags || '', data.try_link).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
