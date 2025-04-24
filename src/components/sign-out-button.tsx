"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <DropdownMenuItem asChild>
      <div
        className="text-red-500 focus:text-red-500 cursor-pointer flex items-center w-full text-left"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign out</span>
      </div>
    </DropdownMenuItem>
  );
}
