export default function AutoFailedTable({ rows }: any) {
  if (!rows.length) {
    return <p className="text-slate-500">No auto-failed transactions</p>;
  }
  return (
    <div>
      <h2 className="font-semibold mb-2">Auto-Failed On-Ramps</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id} className="border-t">
              <td>{r.id}</td>
              <td>{r.userId}</td>
              <td>{r.amount}</td>
              <td>TIMEOUT</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
