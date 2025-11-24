"use client"

import { Appbar } from "@repo/ui";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
  const session = useSession();

  return (
    <div>
      <Appbar
        user={session.data?.user}
        onSignin={() => signIn()}
        onSignout={() => signOut()}
      />

      <div className="p-6">
        <h1 className="text-3xl font-bold">Hello</h1>
      </div>
    </div>
  );
}
