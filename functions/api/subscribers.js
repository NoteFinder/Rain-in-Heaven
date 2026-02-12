export async function onRequestGet(context) {
  const { env } = context;
  try {
    // Database 'DB' must be bound in Cloudflare project settings
    const { results } = await env.DB.prepare(
      "SELECT email, country, created_at FROM subscribers ORDER BY created_at DESC"
    ).all();
    
    return new Response(JSON.stringify(results), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store" 
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
