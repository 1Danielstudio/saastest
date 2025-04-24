import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get("https://api.printful.com/products", {
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        Accept: "application/json",
      },
    });

    return new Response(JSON.stringify(response.data.result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(
      "🔥 Printful Product Fetch Error:",
      err?.response?.data || err.message,
    );
    return new Response(
      JSON.stringify({
        error: "Failed to fetch products",
        details: err?.response?.data || err.message,
      }),
      { status: 500 },
    );
  }
}
