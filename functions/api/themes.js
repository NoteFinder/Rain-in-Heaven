export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  const limit = parseInt(url.searchParams.get('limit')) || 8;
  const offset = parseInt(url.searchParams.get('offset')) || 0;

  try {
    // 1. Get current page results
    const themesQuery = await env.DB.prepare(
      "SELECT * FROM themes ORDER BY id DESC LIMIT ? OFFSET ?"
    ).bind(limit, offset).all();

    // 2. Get total count for the frontend pagination buttons
    const countQuery = await env.DB.prepare("SELECT COUNT(*) as total FROM themes").first();

    return new Response(JSON.stringify({
      results: themesQuery.results,
      total: countQuery.total
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
