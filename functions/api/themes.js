export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  const limit = parseInt(url.searchParams.get('limit')) || 8;
  const offset = parseInt(url.searchParams.get('offset')) || 0;

  try {
    // Get the themes for the current page
    const themes = await env.DB.prepare(
      "SELECT * FROM themes ORDER BY id DESC LIMIT ? OFFSET ?"
    ).bind(limit, offset).all();

    // Get total count for pagination math
    const countResult = await env.DB.prepare("SELECT COUNT(*) as total FROM themes").first();

    return new Response(JSON.stringify({
      results: themes.results,
      total: countResult.total
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
