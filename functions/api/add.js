export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const data = await request.json();
    
    // Insert into D1 without the 'link' column
    await env.DB.prepare(
      "INSERT INTO themes (name, description, image, try_link) VALUES (?, ?, ?, ?)"
    ).bind(data.name, data.description, data.image, data.try_link).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
