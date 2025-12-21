import { getAllTransactions } from "@/lib/action/getTransactions";
import { TransactionsTable } from "@/components/TransactionsTable";

export default async function TransactionsPage() {
  const transactions = await getAllTransactions(20, 0);

  return (
    // Remove h-screen and overflow-hidden from here
    // Let this div naturally fit within the layout
    <div className="w-full bg-[#020617] flex flex-col">
      
      {/* Add fixed height constraint here instead */}
      {/* calc(100vh - X) where X is your AppBar height */}
      <div className="max-w-6xl mx-auto w-full flex flex-col h-[calc(100vh-90px)] p-6 overflow-hidden">
        
        {/* Header - Stays Fixed */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h1 className="text-2xl font-bold text-white">
            Your Transactions
          </h1>
        </div>

        {/* Table Container - Scrollable */}
        <div className="flex-1 min-h-0 pb-6">
          <TransactionsTable transactions={transactions} />
        </div>
        
      </div>
    </div>
  );
}