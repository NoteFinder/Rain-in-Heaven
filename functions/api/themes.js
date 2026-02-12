export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  const limit = parseInt(url.searchParams.get('limit')) || 8;
  const offset = parseInt(url.searchParams.get('offset')) || 0;
  const search = url.searchParams.get('search') || ""; // Get search query

  try {
    let results, total;

    if (search) {
      // Search logic: look for matches in Name or Description
      const searchTerm = `%${search}%`;
      results = await env.DB.prepare(
        "SELECT * FROM themes WHERE name LIKE ? OR description LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?"
      ).bind(searchTerm, searchTerm, limit, offset).all();

      const count = await env.DB.prepare(
        "SELECT COUNT(*) as total FROM themes WHERE name LIKE ? OR description LIKE ?"
      ).bind(searchTerm, searchTerm).first();
      total = count.total;
    } else {
      // Standard pagination logic
      results = await env.DB.prepare(
        "SELECT * FROM themes ORDER BY id DESC LIMIT ? OFFSET ?"
      ).bind(limit, offset).all();
      
      const count = await env.DB.prepare("SELECT COUNT(*) as total FROM themes").first();
      total = count.total;
    }

    return new Response(JSON.stringify({ results: results.results, total }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
