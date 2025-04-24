"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PrintfulProduct, PrintfulVariant } from "@/services/printfulService";

interface ProductSelectorProps {
  onSelect: (productId: number, variantId: number) => void;
}

export default function ProductSelector({ onSelect }: ProductSelectorProps) {
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/get-products");
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductSelect = (productId: number) => {
    setSelectedProductId(productId);
    setSelectedVariantId(null); // Reset variant selection when product changes
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(Number(variantId));
  };

  const handleConfirmSelection = () => {
    if (!selectedProductId || !selectedVariantId) return;

    // Pass the IDs as numbers
    onSelect(selectedProductId, selectedVariantId);
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  if (loading)
    return <div className="p-4 text-center">Loading products...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className={`overflow-hidden transition-shadow cursor-pointer ${selectedProductId === product.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
            onClick={() => handleProductSelect(product.id)}
          >
            <CardContent className="p-4">
              {product.thumbnail_url && (
                <div className="aspect-square w-full mb-3 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={product.thumbnail_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
              <p className="text-xs text-muted-foreground">
                {product.variants?.length || 0}{" "}
                {(product.variants?.length || 0) === 1 ? "variant" : "variants"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <div className="bg-muted p-4 rounded-lg space-y-4">
          <h3 className="font-medium">
            Select a variant for {selectedProduct.name}
          </h3>

          <Select
            onValueChange={handleVariantSelect}
            value={selectedVariantId?.toString() || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a variant" />
            </SelectTrigger>
            <SelectContent>
              {selectedProduct.variants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id.toString()}>
                  {variant.name} - ${variant.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full"
            disabled={!selectedVariantId}
            onClick={handleConfirmSelection}
          >
            Continue with Selected Product
          </Button>
        </div>
      )}
    </div>
  );
}
