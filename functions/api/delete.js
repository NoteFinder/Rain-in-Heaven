export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const { id } = await request.json();
    await env.DB.prepare("DELETE FROM themes WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
