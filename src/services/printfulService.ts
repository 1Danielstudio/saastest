/**
 * Service for interacting with the Printful API
 */

const PRINTFUL_API_URL = "https://api.printful.com";

interface PrintfulProduct {
  id: number;
  name: string;
  thumbnail_url: string;
  variants: PrintfulVariant[];
}

interface PrintfulVariant {
  id: number;
  name: string;
  product_id: number;
  thumbnail_url: string;
  price: string;
}

interface PrintfulPaginatedResponse<T> {
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
  result: T;
}

/**
 * Fetches all products from the Printful API with pagination
 */
export async function fetchAllProducts(): Promise<PrintfulProduct[]> {
  const apiKey = process.env.NEXT_PUBLIC_PRINTFUL_API_KEY;
  if (!apiKey) {
    throw new Error("Printful API key is not defined");
  }

  let allProducts: PrintfulProduct[] = [];
  let offset = 0;
  const limit = 100; // Maximum allowed by Printful API
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await fetch(
        `${PRINTFUL_API_URL}/v2/sync/products?offset=${offset}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to fetch products: ${errorData.result || response.statusText}`,
        );
      }

      const data: PrintfulPaginatedResponse<PrintfulProduct[]> =
        await response.json();
      allProducts = [...allProducts, ...data.result];

      // Check if there are more products to fetch
      offset += limit;
      hasMore = offset < data.paging.total;
    } catch (error) {
      console.error("Error fetching Printful products:", error);
      throw error;
    }
  }

  return allProducts;
}

/**
 * Fetches a specific product by ID
 */
export async function fetchProductById(
  productId: number,
): Promise<PrintfulProduct | null> {
  const apiKey = process.env.NEXT_PUBLIC_PRINTFUL_API_KEY;
  if (!apiKey) {
    throw new Error("Printful API key is not defined");
  }

  try {
    const response = await fetch(
      `${PRINTFUL_API_URL}/v2/sync/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch product: ${errorData.result || response.statusText}`,
      );
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`Error fetching Printful product ${productId}:`, error);
    throw error;
  }
}

export type { PrintfulProduct, PrintfulVariant };
