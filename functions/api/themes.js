// functions/api/themes.js
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  const limit = parseInt(url.searchParams.get('limit')) || 8;
  const offset = parseInt(url.searchParams.get('offset')) || 0;
  const search = url.searchParams.get('search') || "";
  const tag = url.searchParams.get('tag') || "";  // NEW: tag filter

  try {
    let results, total;

    if (tag) {
      // Filter by tag (LIKE match on the tags column)
      const tagTerm = `%${tag}%`;
      if (search) {
        const searchTerm = `%${search}%`;
        results = await env.DB.prepare(
          "SELECT * FROM themes WHERE tags LIKE ? AND (name LIKE ? OR description LIKE ?) ORDER BY id DESC LIMIT ? OFFSET ?"
        ).bind(tagTerm, searchTerm, searchTerm, limit, offset).all();
        const count = await env.DB.prepare(
          "SELECT COUNT(*) as total FROM themes WHERE tags LIKE ? AND (name LIKE ? OR description LIKE ?)"
        ).bind(tagTerm, searchTerm, searchTerm).first();
        total = count.total;
      } else {
        results = await env.DB.prepare(
          "SELECT * FROM themes WHERE tags LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?"
        ).bind(tagTerm, limit, offset).all();
        const count = await env.DB.prepare(
          "SELECT COUNT(*) as total FROM themes WHERE tags LIKE ?"
        ).bind(tagTerm).first();
        total = count.total;
      }
    } else if (search) {
      const searchTerm = `%${search}%`;
      results = await env.DB.prepare(
        "SELECT * FROM themes WHERE name LIKE ? OR description LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?"
      ).bind(searchTerm, searchTerm, limit, offset).all();
      const count = await env.DB.prepare(
        "SELECT COUNT(*) as total FROM themes WHERE name LIKE ? OR description LIKE ?"
      ).bind(searchTerm, searchTerm).first();
      total = count.total;
    } else {
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
