"use client";
import { signIn, signOut } from "next-auth/react";
import { Appbar } from "@repo/ui";

export function AppbarClient({ user }: { user?: { name?: string | null } }) {
  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={async () => {
          await signOut({ callbackUrl: "/api/auth/signin" });
        }}
        user={user}
      />
    </div>
  );
}
