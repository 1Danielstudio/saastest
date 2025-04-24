import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  ShoppingBag,
  Image,
  Users,
  TrendingUp,
  BarChart,
} from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // This would be replaced with actual data from your database
  const dashboardStats = {
    designs: 5,
    orders: 3,
    earnings: "$124.50",
    referrals: 8,
  };

  return (
    <SubscriptionCheck>
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <header>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your print-on-demand business
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Saved Designs
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {dashboardStats.designs}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Image className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {dashboardStats.orders}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Affiliate Earnings
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {dashboardStats.earnings}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Referrals
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {dashboardStats.referrals}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                asChild
                className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              >
                <Link href="/design-maker">
                  <Wand2 className="h-8 w-8 mb-2" />
                  <span className="text-lg font-medium">Create New Design</span>
                  <span className="text-xs text-muted-foreground">
                    Design custom products with AI
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              >
                <Link href="/designs">
                  <Image className="h-8 w-8 mb-2" />
                  <span className="text-lg font-medium">
                    View Saved Designs
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Browse your design library
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              >
                <Link href="/affiliate">
                  <Users className="h-8 w-8 mb-2" />
                  <span className="text-lg font-medium">
                    Affiliate Dashboard
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Track referrals and earnings
                  </span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest product orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "ORD-1234",
                    date: "2023-08-15",
                    status: "Delivered",
                    product: "Mountain Sunset Tee",
                  },
                  {
                    id: "ORD-1235",
                    date: "2023-09-22",
                    status: "Shipped",
                    product: "Ocean Waves Hoodie",
                  },
                  {
                    id: "ORD-1236",
                    date: "2023-10-10",
                    status: "Processing",
                    product: "Abstract Art Mug",
                  },
                ].map((order, index) => (
                  <div
                    key={`order-${order.id}-${index}`}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{order.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.id} • {order.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/orders">View All Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Your sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] flex items-center justify-center border rounded-lg bg-muted/20">
                <div className="text-center">
                  <BarChart className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sales chart will appear here
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl font-bold">$245.80</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-xl font-bold">$189.25</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SubscriptionCheck>
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
