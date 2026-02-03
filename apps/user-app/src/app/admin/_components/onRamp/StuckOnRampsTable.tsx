export default function StuckOnRampsTable({ rows }: any) {
  if (!rows.length) {
    return (
      <div className="border rounded-lg p-6 bg-green-50 border-green-200">
        <p className="text-green-700 font-medium">✓ No stuck on-ramp transactions</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-slate-100 px-4 py-3 border-b">
        <h3 className="font-semibold text-slate-800">
          Stuck On-Ramp Transactions
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Transactions stuck in PROCESSING state
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left border-b">
              <th className="p-3 font-medium text-slate-700">ID</th>
              <th className="p-3 font-medium text-slate-700">User</th>
              <th className="p-3 font-medium text-slate-700">Amount</th>
              <th className="p-3 font-medium text-slate-700">Provider</th>
              <th className="p-3 font-medium text-slate-700">Started</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((r: any) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-3">{r.id}</td>
                <td className="p-3">{r.userId}</td>
                <td className="p-3 font-medium">₹{r.amount}</td>
                <td className="p-3">{r.provider}</td>
                <td className="p-3 text-slate-600">
                  {new Date(r.startTime).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}