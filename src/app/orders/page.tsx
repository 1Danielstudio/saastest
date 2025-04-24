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
import { Package, ExternalLink, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function OrderHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // This would be replaced with actual data from your database
  const orders = [
    {
      id: "ORD-1234",
      date: "2023-08-15",
      status: "Delivered",
      total: "$49.99",
      items: 2,
      tracking: "1Z999AA10123456784",
    },
    {
      id: "ORD-1235",
      date: "2023-09-22",
      status: "Shipped",
      total: "$35.50",
      items: 1,
      tracking: "1Z999AA10123456785",
    },
    {
      id: "ORD-1236",
      date: "2023-10-10",
      status: "Processing",
      total: "$89.97",
      items: 3,
      tracking: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Order History</h1>
          <Button asChild>
            <Link href="/design-maker">
              <ShoppingBag className="mr-2 h-4 w-4" /> Create New Order
            </Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet.
              </p>
              <Button asChild>
                <Link href="/design-maker">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Create Your First
                  Order
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <CardDescription>
                    Ordered on {order.date} • {order.items}{" "}
                    {order.items === 1 ? "item" : "items"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-medium">Total: {order.total}</p>
                      {order.tracking && (
                        <div className="flex items-center mt-1 text-sm">
                          <Package className="h-3 w-3 mr-1" />
                          <span>Tracking: {order.tracking}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>View Details</Link>
                      </Button>
                      {order.status !== "Processing" && (
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" /> Track
                          Package
                        </Button>
                      )}
                    </div>
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
