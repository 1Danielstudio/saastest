import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Define safeProductId at the top level so it's available in the catch block
  let safeProductId: string;

  try {
    const { user_id, product_id, user_agent, ip_address } = await req.json();

    if (!user_id || !user_agent) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "User ID and User Agent are required",
        },
        { status: 400 },
      );
    }

    // Check if PRINTFUL_API_KEY is available
    if (!process.env.PRINTFUL_API_KEY) {
      console.error("PRINTFUL_API_KEY is not set in environment variables");
      return NextResponse.json(
        {
          error: "API key not configured",
          message:
            "The Printful API key is not configured. Please set the PRINTFUL_API_KEY environment variable.",
        },
        { status: 500 },
      );
    }

    // Require a product ID to be provided
    if (!product_id) {
      return NextResponse.json(
        {
          error: "Missing product ID",
          message: "A product ID is required to generate a nonce",
        },
        { status: 400 },
      );
    }

    safeProductId = product_id;

    console.log("Sending request to Printful with product ID:", safeProductId);
    console.log("Using user_id:", user_id);

    // List of known working Printful product IDs for reference
    const knownProductIds = {
      "233": "Men's Premium T-Shirt",
      "278": "Women's Relaxed T-Shirt",
      "83": "Unisex Hoodie",
    };

    // Check if the product ID is in our list of known working IDs
    const isKnownProduct = knownProductIds[safeProductId] !== undefined;

    console.log(
      "Is this a known product ID?",
      isKnownProduct ? knownProductIds[safeProductId] : "Unknown product",
    );

    // Reject if using an unknown product ID
    if (!isKnownProduct) {
      console.error(
        `Error: Using an unknown product ID (${safeProductId}). This will cause 404 errors.`,
        `Known working IDs: ${Object.keys(knownProductIds).join(", ")}`,
      );

      return NextResponse.json(
        {
          error: "Invalid product ID",
          message: `The product ID '${safeProductId}' is not supported. Please use one of the following IDs: ${Object.keys(knownProductIds).join(", ")}`,
          validProducts: knownProductIds,
        },
        { status: 400 },
      );
    }

    const response = await axios.post(
      "https://api.printful.com/embedded-designer/nonces",
      {
        external_customer_id: user_id,
        external_product_id: safeProductId,
        ip_address: ip_address || req.ip || "127.0.0.1",
        user_agent,
      },
      {
        timeout: 10000, // ⏱️ Wait up to 10 seconds
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const nonce = response.data?.result?.nonce;

    if (!nonce) {
      console.error("Printful did not return a nonce:", response.data);
      return NextResponse.json(
        { error: "Printful did not return a nonce" },
        { status: 500 },
      );
    }

    return NextResponse.json({ nonce }, { status: 200 });
  } catch (err: any) {
    console.error("🔥 Full Printful API error:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
      console.error("Headers:", err.response.headers);

      // If we get a 404 Not Found error, it's likely due to an invalid product ID
      if (err.response.status === 404) {
        console.error(
          "Product ID not found or API key invalid:",
          safeProductId,
        );
        return NextResponse.json(
          {
            error: "Invalid product ID or API key",
            message:
              "The product ID provided was not found on Printful or your API key is invalid. Make sure your PRINTFUL_API_KEY is correct and the product ID exists.",
            details: err.response.data,
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to generate nonce",
        details: err.response?.data || err.message,
      },
      { status: 502 },
    );
  }
}
