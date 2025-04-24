"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import PrintfulEDM from "@/components/printful-edm";
import ProductSelector from "@/components/productSelector"; // Using the existing component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Image, Save, ShoppingCart } from "lucide-react";

export default function DesignMaker() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiImages, setAiImages] = useState<string[]>([]);
  const [designId, setDesignId] = useState<string>("");
  const [designName, setDesignName] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<number>();
  const [selectedVariantId, setSelectedVariantId] = useState<number>();

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        redirect("/sign-in");
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleGenerateAI = async () => {
    if (!prompt) return;
    setGenerating(true);
    setTimeout(() => {
      setAiImages([
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
        "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80",
      ]);
      setGenerating(false);
    }, 2000);
  };

  const handlePlaceOrder = async () => {
    if (!designId || !selectedProductId || !selectedVariantId || !user) return;
    console.log("Placing order:", {
      designId,
      productId: selectedProductId,
      variantId: selectedVariantId,
      userId: user.id,
    });
    alert("Order placed successfully! (This would normally trigger checkout)");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Design Maker</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="products">Select Product</TabsTrigger>
            <TabsTrigger value="design">Design Editor</TabsTrigger>
            <TabsTrigger value="checkout">Review & Order</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Choose a Product</CardTitle>
                <CardDescription>
                  Select a Printful product to customize
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductSelector
                  onSelect={(productId, variantId) => {
                    // Ensure we're working with numbers
                    setSelectedProductId(Number(productId));
                    setSelectedVariantId(Number(variantId));
                    setActiveTab("design");
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Design Canvas */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Design Canvas</CardTitle>
                    <CardDescription>
                      Powered by Printful's Design Maker
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PrintfulEDM
                      className="w-full h-[600px] rounded-lg"
                      productId={selectedProductId}
                      variantId={selectedVariantId}
                      designId={designId}
                      onProductSelect={(productId, variantId) => {
                        setSelectedProductId(productId);
                        setSelectedVariantId(variantId);
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Tools */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Design Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Wand2 className="h-4 w-4" /> AI Image Generator
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="prompt">Prompt</Label>
                        <div className="flex gap-2">
                          <Input
                            id="prompt"
                            placeholder="E.g., Galaxy cat in hoodie"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                          />
                          <Button
                            onClick={handleGenerateAI}
                            disabled={generating}
                          >
                            {generating ? "Generating..." : "Generate"}
                          </Button>
                        </div>
                      </div>
                      {aiImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {aiImages.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              onClick={() => {
                                if (window?.pfDesignMaker) {
                                  window.pfDesignMaker.applyImageFromUrl({
                                    url: img,
                                    placement: "front",
                                  });
                                }
                              }}
                              className="rounded border cursor-pointer hover:border-primary"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex gap-2">
                      <Button
                        variant="outline"
                        className="w-1/2"
                        onClick={() => {
                          const edm = document.getElementById(
                            "printful-edm-container",
                          );
                          if (edm && edm.__edm) {
                            edm.__edm.saveDesign();
                          }
                        }}
                      >
                        <Save className="mr-2 h-4 w-4" /> Save Design
                      </Button>
                      <Button
                        className="w-1/2"
                        onClick={() => setActiveTab("checkout")}
                      >
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checkout">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your design before ordering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Selected Product</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedProductId
                          ? `Product ID: ${selectedProductId}`
                          : "No product selected"}
                      </p>
                    </div>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={!designId || !selectedProductId}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Place Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
