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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  Users as UsersIcon,
  Link as LinkIcon,
} from "lucide-react";
import CopyButton from "@/components/copy-button";

export default async function AffiliateDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // This would be replaced with actual data from your database
  const affiliateStats = {
    referralLink: `https://printai.com/ref/${user.id.substring(0, 8)}`,
    totalEarnings: "$245.50",
    pendingEarnings: "$32.75",
    paidEarnings: "$212.75",
    referrals: 17,
    conversionRate: "8.5%",
    monthlyStats: [
      { month: "Jan", earnings: 25 },
      { month: "Feb", earnings: 30 },
      { month: "Mar", earnings: 45 },
      { month: "Apr", earnings: 35 },
      { month: "May", earnings: 50 },
      { month: "Jun", earnings: 60 },
    ],
    recentReferrals: [
      { id: 1, date: "2023-06-15", status: "Converted", commission: "$12.50" },
      { id: 2, date: "2023-06-18", status: "Converted", commission: "$9.75" },
      { id: 3, date: "2023-06-20", status: "Pending", commission: "$10.50" },
      { id: 4, date: "2023-06-22", status: "Pending", commission: "$0.00" },
    ],
    paymentHistory: [
      { id: "PMT-001", date: "2023-05-01", amount: "$87.25", method: "PayPal" },
      {
        id: "PMT-002",
        date: "2023-06-01",
        amount: "$125.50",
        method: "Bank Transfer",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Affiliate Dashboard</h1>

        {/* Referral Link Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link to earn commissions on referred customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Input
                  value={affiliateStats.referralLink}
                  readOnly
                  className="pr-10"
                />
                <CopyButton
                  value={affiliateStats.referralLink}
                  className="absolute right-0 top-0 h-full"
                />
              </div>
              <Button>
                <LinkIcon className="mr-2 h-4 w-4" /> Generate Custom Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {affiliateStats.totalEarnings}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Earnings
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {affiliateStats.pendingEarnings}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
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
                    {affiliateStats.referrals}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Conversion Rate
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {affiliateStats.conversionRate}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="referrals" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="referrals">Recent Referrals</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Materials</TabsTrigger>
          </TabsList>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>
                  Track your recent referral activity and commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">ID</th>
                        <th className="text-left py-3 px-4 font-medium">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Status
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          Commission
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {affiliateStats.recentReferrals.map((referral) => (
                        <tr
                          key={referral.id}
                          className="border-b last:border-0"
                        >
                          <td className="py-3 px-4">#{referral.id}</td>
                          <td className="py-3 px-4">{referral.date}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${referral.status === "Converted" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                            >
                              {referral.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {referral.commission}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View your past affiliate commission payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">
                          Payment ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Method
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {affiliateStats.paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b last:border-0">
                          <td className="py-3 px-4">{payment.id}</td>
                          <td className="py-3 px-4">{payment.date}</td>
                          <td className="py-3 px-4">{payment.method}</td>
                          <td className="py-3 px-4 text-right font-medium">
                            {payment.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Materials</CardTitle>
                <CardDescription>
                  Download banners, logos, and other promotional materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Banner 300x250", type: "Image", size: "42 KB" },
                    { name: "Banner 728x90", type: "Image", size: "38 KB" },
                    { name: "Logo Pack", type: "ZIP", size: "1.2 MB" },
                    { name: "Email Template", type: "HTML", size: "8 KB" },
                    {
                      name: "Product Descriptions",
                      type: "PDF",
                      size: "256 KB",
                    },
                    { name: "Social Media Kit", type: "ZIP", size: "3.5 MB" },
                  ].map((material, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{material.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {material.type} • {material.size}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
