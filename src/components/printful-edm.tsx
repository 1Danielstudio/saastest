"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";

interface PrintfulEDMProps {
  className?: string;
  productId?: number;
  variantId?: number;
  designId?: string;
  onProductSelect?: (productId: number, variantId: number) => void;
  onDesignSave?: (designId: string) => void;
  onDesignSubmit?: (
    designId: string,
    productId: number,
    variantId: number,
  ) => void;
}

declare global {
  interface Window {
    PFDesignMaker: any;
    pfDesignMaker: any;
  }
}

export default function PrintfulEDM({
  className = "",
  productId,
  variantId,
  designId,
  onProductSelect,
}: PrintfulEDMProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip execution during SSR
    if (typeof window === "undefined") return;

    const loadEDM = async () => {
      if (!containerRef.current) return;

      setLoading(true);
      setError(null);

      // Validate product ID before making the request
      if (!productId || !variantId) {
        setError(
          "Please select a product to continue. No product ID was provided.",
        );
        setLoading(false);
        return;
      }

      // Validate against known working product IDs
      const knownProductIds = [83, 233, 278];
      if (!knownProductIds.includes(Number(productId))) {
        setError(
          `Invalid product ID (${productId}). Please use one of the following IDs: ${knownProductIds.join(", ")}`,
        );
        setLoading(false);
        return;
      }

      // Validate variant IDs against known working variants
      const validVariantMap = {
        83: [4012], // Unisex Hoodie variants
        233: [7853], // Men's T-shirt variants
        278: [9627], // Women's T-shirt variants
      };

      const productIdNum = Number(productId);
      const variantIdNum = Number(variantId);

      if (!validVariantMap[productIdNum]?.includes(variantIdNum)) {
        setError(
          `Invalid variant ID (${variantId}) for product ${productId}. Please use one of the following variants: ${validVariantMap[productIdNum]?.join(", ") || "none available"}`,
        );
        setLoading(false);
        return;
      }

      try {
        // Ensure we're in a browser environment
        if (typeof navigator === "undefined") {
          setError("Browser environment required");
          setLoading(false);
          return;
        }

        // Create a stable user ID using sessionStorage
        let userId = sessionStorage.getItem("printful_user_id");
        if (!userId) {
          userId = "demo-user-" + Math.random().toString(36).substring(2, 10);
          sessionStorage.setItem("printful_user_id", userId);
        }

        console.log("Requesting nonce with user agent:", navigator.userAgent);

        const response = await fetch("/api/generate-nonce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            user_agent: navigator.userAgent,
            product_id: String(productId),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to get nonce:", data);
          setError(
            `API Error (${response.status}): ${data.message || data.error || "Failed to get nonce from Printful"}`,
          );
          setLoading(false);
          return;
        }

        const { nonce } = data;

        if (!nonce) {
          setError("No nonce returned from server");
          setLoading(false);
          return;
        }

        if (!window.PFDesignMaker) {
          const script = document.createElement("script");
          script.src = "https://static.printful.com/static/designer/embed.js";
          script.onload = () => {
            initializeEDM(nonce);
          };
          script.onerror = () => {
            setError("Failed to load Printful Design Maker script");
            setLoading(false);
          };
          document.head.appendChild(script);
        } else {
          initializeEDM(nonce);
        }
      } catch (error) {
        console.error("Error loading Printful EDM:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Unknown error loading Printful EDM",
        );
        setLoading(false);
      }

      function initializeEDM(nonce: string) {
        if (!containerRef.current) return;

        try {
          const edm = new window.PFDesignMaker({
            elemId: containerRef.current.id,
            nonce,
            initProduct:
              productId && variantId
                ? {
                    productId: Number(productId),
                    variantId: Number(variantId),
                  }
                : undefined,
            onTemplateSaved: (template: any) => {
              console.log("✅ Template Saved:", template);
              if (onDesignSave && template?.id) {
                onDesignSave(template.id);
              }
            },
            onDesignStatusUpdate: (status: any) => {
              console.log("ℹ️ Status Update:", status);
              setLoading(false);
            },
            onDesignSubmit: (data: any) => {
              console.log("🚀 Design Submitted:", data);
              if (onDesignSubmit && data?.design_id && productId && variantId) {
                onDesignSubmit(
                  data.design_id,
                  Number(productId),
                  Number(variantId),
                );
              }
            },
          });

          // Attach for global reference
          (containerRef.current as any).__edm = edm;
          window.pfDesignMaker = edm;
        } catch (error) {
          console.error("Error initializing Printful EDM:", error);
          setError(
            error instanceof Error
              ? error.message
              : "Unknown error initializing Printful EDM",
          );
          setLoading(false);
        }
      }
    };

    loadEDM();
  }, [designId, productId, variantId]);

  if (error) {
    return (
      <Card className={`p-4 bg-red-50 ${className}`}>
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          Error Loading Design Maker
        </h3>
        <p className="text-red-600">{error}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-2">
            {error.includes("select a product") || error.includes("Not Found")
              ? "Please select a valid product to continue:"
              : "Please check your Printful API key and ensure it has the correct permissions."}
          </p>
          {(error.includes("select a product") ||
            error.includes("Not Found") ||
            error.includes("Invalid product") ||
            error.includes("variant")) && (
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => {
                  if (onProductSelect) {
                    // Example product - Men's Premium T-Shirt with variant
                    onProductSelect(233, 7853);
                    setError(null);
                    setLoading(true);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Use Men's T-shirt
              </button>
              <button
                onClick={() => {
                  if (onProductSelect) {
                    // Women's Relaxed T-Shirt with variant
                    onProductSelect(278, 9627);
                    setError(null);
                    setLoading(true);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Use Women's T-shirt
              </button>
              <button
                onClick={() => {
                  if (onProductSelect) {
                    // Unisex Hoodie with variant
                    onProductSelect(83, 4012);
                    setError(null);
                    setLoading(true);
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Use Unisex Hoodie
              </button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      <div
        id="printful-edm-container"
        ref={containerRef}
        className={`min-h-[400px] w-full ${loading ? "opacity-30" : "opacity-100"}`}
      />
    </div>
  );
}
