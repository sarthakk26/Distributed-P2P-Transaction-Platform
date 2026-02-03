export default function FailedWithLockedBalanceTable({ rows }: any) {
  if (!rows.length) {
    return <p className="text-slate-500">No failed transfers with locked balance 🎉</p>;
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Failed Transfers with Locked Balance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2">Transfer ID</th>
              <th className="p-2">User Number</th>
              <th className="p-2">Transfer Amount</th>
              <th className="p-2">Locked Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t hover:bg-slate-50">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.fromUser.number}</td>
                <td className="p-2">₹{r.amount}</td>
                <td className="p-2 text-red-600 font-medium">
                  ₹{r.fromUser.Balance.locked}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}