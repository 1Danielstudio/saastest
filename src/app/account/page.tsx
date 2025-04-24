import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "../../components/dashboard-navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Bell, Shield } from "lucide-react";

export default async function AccountSettings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" /> Subscription
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        defaultValue={user.user_metadata?.full_name || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Your email address is verified and cannot be changed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue={user.user_metadata?.phone || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        defaultValue={user.user_metadata?.company || ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <textarea
                      id="bio"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                      defaultValue={user.user_metadata?.bio || ""}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg">Premium Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          $29.99/month • Renews on July 15, 2023
                        </p>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Payment Method</h3>
                    <div className="bg-muted/50 rounded-lg p-4 border mb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-card p-2 rounded">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">
                              Expires 12/25
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Billing History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Description
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Amount
                            </th>
                            <th className="text-right py-3 px-4 font-medium">
                              Receipt
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4">Jun 15, 2023</td>
                            <td className="py-3 px-4">
                              Premium Plan - Monthly
                            </td>
                            <td className="py-3 px-4">$29.99</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">May 15, 2023</td>
                            <td className="py-3 px-4">
                              Premium Plan - Monthly
                            </td>
                            <td className="py-3 px-4">$29.99</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        {
                          id: "order-updates",
                          label: "Order Updates",
                          description:
                            "Receive notifications about your order status",
                        },
                        {
                          id: "product-updates",
                          label: "Product Updates",
                          description:
                            "Be notified about new features and improvements",
                        },
                        {
                          id: "promotional",
                          label: "Promotional Emails",
                          description: "Receive special offers and promotions",
                        },
                        {
                          id: "newsletter",
                          label: "Newsletter",
                          description:
                            "Get our monthly newsletter with tips and trends",
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-3"
                        >
                          <input
                            type="checkbox"
                            id={item.id}
                            defaultChecked={item.id !== "promotional"}
                            className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                          />
                          <div>
                            <label htmlFor={item.id} className="font-medium">
                              {item.label}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Push Notifications</h3>
                    <div className="space-y-4">
                      {[
                        {
                          id: "push-order",
                          label: "Order Status",
                          description:
                            "Get real-time updates about your orders",
                        },
                        {
                          id: "push-marketing",
                          label: "Marketing",
                          description: "Receive promotional notifications",
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-3"
                        >
                          <input
                            type="checkbox"
                            id={item.id}
                            defaultChecked={item.id === "push-order"}
                            className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                          />
                          <div>
                            <label htmlFor={item.id} className="font-medium">
                              {item.label}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Change Password</h3>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button type="submit">Update Password</Button>
                    </form>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an extra layer of security to your account by enabling
                      two-factor authentication.
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">Sessions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      These are the devices that are currently logged into your
                      account.
                    </p>
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg border">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">
                              Chrome on Windows • San Francisco, USA
                            </p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Sign Out of All Devices
                      </Button>
                    </div>
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
