import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
import { authOptions } from "../lib/auth";
import LandingPageClient from "./LandingPageClient"
export default async function Page() {
  const session = await getServerSession(authOptions);
  
  // If user is logged in, redirect to dashboard
  if (session?.user) {
    redirect('/dashboard');
  }
  // If not logged in, show landing page
  return <LandingPageClient />;
}