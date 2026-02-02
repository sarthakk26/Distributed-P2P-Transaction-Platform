export default function StuckOnRampsTable({ rows }: any) {
  if (!rows.length) {
    return <p className="text-slate-500">No stuck on-ramp transactions 🎉</p>;
  }

  return (
    <div>
      <h2 className="font-semibold mb-2">Stuck On-Ramp Transactions</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Provider</th>
            <th>Started</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id} className="border-t">
              <td>{r.id}</td>
              <td>{r.userId}</td>
              <td>{r.amount}</td>
              <td>{r.provider}</td>
              <td>{new Date(r.startTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
