export async function onRequest(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM themes ORDER BY id DESC"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
