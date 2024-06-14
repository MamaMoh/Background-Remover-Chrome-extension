export default async function handler(req, res) {
   // Log the request body to console

  const response = await fetch(
    "https://api.replicate.com/v1/predictions/" + req.query.id,
    {
      headers: {
        Authorization: `Token ${req.query.apiToken}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      mode:"no-cors",
    }
  );
  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const result = await response.json();
  res.end(JSON.stringify(result));
}
