export default function StuckLockedTransfersTable({ rows }: any) {
  if (!rows.length) {
    return <p className="text-slate-500">No stuck locked transfers 🎉</p>;
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Stuck Locked Transfers</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2">Transfer ID</th>
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Locked Since</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t hover:bg-slate-50">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.fromUser.number}</td>
                <td className="p-2">{r.toUser.number}</td>
                <td className="p-2">₹{r.amount}</td>
                <td className="p-2">{new Date(r.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}