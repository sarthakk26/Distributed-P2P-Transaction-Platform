"use client";

import { Navbar } from "@repo/ui";
import { signOut } from "next-auth/react";

interface NavbarWrapperProps {
  user?: {
    name?: string | null;
    id?: string | null;
  };
  avatarId?: number;
}

export const NavbarWrapper = ({ user, avatarId }: NavbarWrapperProps) => {
  const handleSignout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return <Navbar user={user} onSignout={handleSignout} avatarId={avatarId} />;
};