export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return new Response("No file", { status: 400 });

    const fileName = `${Date.now()}-${file.name}`;
    // This requires the "BUCKET" binding in your Settings
    await env.BUCKET.put(fileName, file);

    return new Response(JSON.stringify({ path: fileName }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
