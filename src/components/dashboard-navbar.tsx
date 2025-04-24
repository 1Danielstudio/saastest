"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, CreditCard, Settings, Users } from "lucide-react";
import SignOutButton from "./sign-out-button";

export default function DashboardNavbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Designs",
      href: "/designs",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Orders",
      href: "/orders",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Affiliate",
      href: "/affiliate",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Account",
      href: "/account",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              PrintfulSaaS
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5"}`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 ${isActive ? "text-primary" : "text-gray-600"}`}
              >
                <span>{item.icon}</span>
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
