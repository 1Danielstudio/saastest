import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ShoppingCart, Plus } from "lucide-react";
import Link from "next/link";

export default async function SavedDesigns() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // This would be replaced with actual data from your database
  const savedDesigns = [
    {
      id: 1,
      name: "Mountain Sunset Tee",
      product: "T-Shirt",
      thumbnail:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&q=80",
      created: "2023-05-15",
    },
    {
      id: 2,
      name: "Ocean Waves Hoodie",
      product: "Hoodie",
      thumbnail:
        "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=300&q=80",
      created: "2023-06-22",
    },
    {
      id: 3,
      name: "Abstract Art Mug",
      product: "Mug",
      thumbnail:
        "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300&q=80",
      created: "2023-07-10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Saved Designs</h1>
          <Button asChild>
            <Link href="/design-maker">
              <Plus className="mr-2 h-4 w-4" /> Create New Design
            </Link>
          </Button>
        </div>

        {savedDesigns.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                You don't have any saved designs yet.
              </p>
              <Button asChild>
                <Link href="/design-maker">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Design
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDesigns.map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={design.thumbnail}
                    alt={design.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{design.name}</CardTitle>
                  <CardDescription>
                    Product: {design.product} • Created: {design.created}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/design-maker?design=${design.id}`}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link
                        href={`/design-maker?design=${design.id}&checkout=true`}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Order
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-10 p-0">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
