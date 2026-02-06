export default function InvalidLockedStateTable({ rows }: any) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border-2 border-green-500/50 bg-green-950/30 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900/50">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-green-300">All clear</p>
            <p className="text-sm text-green-200">No invalid locked states</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-sm">
      <div className="border-b border-slate-700 bg-slate-800/50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-900/50">
            <svg className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Invalid Locked States</h3>
            <p className="text-xs text-slate-400">Locked balance inconsistencies detected</p>
          </div>
          <div className="ml-auto rounded-full bg-yellow-900/50 px-2.5 py-1 text-xs font-semibold text-yellow-300">
            {rows.length}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Transfer ID</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">User Number</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Required Amount</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Actual Locked</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Issue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-800">
            {rows.map((r: any, idx: number) => {
              const issue = !r.fromUser.Balance 
                ? 'Missing balance row' 
                : 'Insufficient locked amount';
              return (
                <tr key={r.id} className={`transition-colors hover:bg-slate-700/50 ${idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-100">{r.id}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-100">{r.fromUser.number}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-100">₹{r.amount}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {r.fromUser.Balance ? (
                      <span className="text-red-400 font-medium">₹{r.fromUser.Balance.locked}</span>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      !r.fromUser.Balance 
                        ? 'bg-red-900/50 text-red-300' 
                        : 'bg-yellow-900/50 text-yellow-300'
                    }`}>
                      {issue}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
