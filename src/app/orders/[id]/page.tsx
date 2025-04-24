import { createClient } from "../../../../supabase/server";
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
import { ArrowLeft, Package, ExternalLink, Printer } from "lucide-react";
import Link from "next/link";

export default async function OrderDetails({
  params,
}: {
  params: { id: string };
}) {
  const orderId = params.id;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // This would be replaced with actual data from your database
  const order = {
    id: orderId,
    date: "2023-08-15",
    status: "Delivered",
    total: "$49.99",
    shipping: "$4.99",
    subtotal: "$45.00",
    tracking: "1Z999AA10123456784",
    address: {
      name: "John Doe",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA",
    },
    items: [
      {
        id: 1,
        name: "Mountain Sunset Tee",
        product: "T-Shirt",
        size: "Medium",
        color: "Black",
        price: "$29.99",
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&q=80",
      },
      {
        id: 2,
        name: "Ocean Waves Mug",
        product: "Mug",
        size: "Standard",
        color: "White",
        price: "$15.00",
        quantity: 1,
        thumbnail:
          "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300&q=80",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/orders"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Orders
          </Link>

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Order {order.id}</h1>
            <span
              className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-muted-foreground">Placed on {order.date}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product} • {item.size} • {item.color}
                        </p>
                        <div className="flex justify-between mt-2">
                          <p>Qty: {item.quantity}</p>
                          <p className="font-medium">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p>{order.address.name}</p>
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.state}{" "}
                      {order.address.zip}
                    </p>
                    <p>{order.address.country}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Shipping Method</h3>
                    <p>Standard Shipping</p>
                    {order.tracking && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">
                          Tracking Information
                        </h3>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{order.tracking}</span>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <ExternalLink className="mr-2 h-4 w-4" /> Track
                          Package
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.shipping}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>{order.total}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button className="w-full" variant="outline">
                    <Printer className="mr-2 h-4 w-4" /> Print Receipt
                  </Button>
                  {order.status === "Delivered" && (
                    <Button className="w-full">Reorder</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Shipped":
      return "bg-blue-100 text-blue-800";
    case "Processing":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
