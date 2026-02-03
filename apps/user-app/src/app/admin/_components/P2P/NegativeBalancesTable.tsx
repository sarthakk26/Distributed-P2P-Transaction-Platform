export default function NegativeBalancesTable({ rows }: any) {
  if (!rows.length) {
    return <p className="text-slate-500">No negative balances 🎉</p>;
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Negative Balances</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2">User Number</th>
              <th className="p-2">Balance Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any, idx: number) => (
              <tr key={idx} className="border-t hover:bg-slate-50">
                <td className="p-2">{r.user.number}</td>
                <td className="p-2 text-red-600 font-bold">
                  ₹{r.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}