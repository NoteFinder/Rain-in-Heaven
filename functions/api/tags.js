// functions/api/tags.js
// SETUP: Run this SQL in your D1 console first:
// CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL);

export async function onRequest(context) {
  const { env, request } = context;
  const method = request.method;

  try {
    if (method === 'GET') {
      const result = await env.DB.prepare("SELECT name FROM tags ORDER BY name ASC").all();
      const tags = result.results.map(r => r.name);
      return new Response(JSON.stringify(tags), {
        headers: { "Content-Type": "application/json" }
      });

    } else if (method === 'POST') {
      const { tag } = await request.json();
      if (!tag) return new Response("Missing tag", { status: 400 });
      await env.DB.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").bind(tag).run();
      return new Response(JSON.stringify({ success: true }), { status: 200 });

    } else if (method === 'DELETE') {
      const { tag } = await request.json();
      if (!tag) return new Response("Missing tag", { status: 400 });
      await env.DB.prepare("DELETE FROM tags WHERE name = ?").bind(tag).run();
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
