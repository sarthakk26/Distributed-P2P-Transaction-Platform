import { SidebarItem } from "@/components/SidebarItem";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { AppbarClient } from "@/components/AppbarClient";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    // 1. Root: Flex Column so Appbar stacks on top of the content
    <div className="flex flex-col h-screen overflow-hidden bg-[#0B0F19]">
      
      {/* 2. Appbar: Now sits at the very top, full width */}
      <div className="w-full bg-black">
        <AppbarClient user={session?.user} />
      </div>

      {/* 3. Content Wrapper: Holds Sidebar and Main Content side-by-side */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-72 bg-[#020617] pt-8 hidden md:block">
          <div className="flex flex-col gap-2 px-2">
            <SidebarItem href={"/dashboard"} icon={<HomeIcon />} title="Home" />
            <SidebarItem href={"/transactions"} icon={<TransactionsIcon />} title="Transaction" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#020617]">
          {children}
        </div>
        
      </div>
    </div>
  );
}

// Icons (Unchanged)
function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}
function TransactionsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}