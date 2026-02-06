import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/db";

type TransitionLog = {
  id: number;
  domain: "P2P" | "ONRAMP";
  entityId: number;
  fromState: string;
  toState: string;
  createdAt: string;
  meta: Record<string, any>;
};

export default async function TransitionLogs() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-sm text-red-500">
        Please sign in to view transition logs
      </div>
    );
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="text-sm text-red-500">
        You don't have permission to view this
      </div>
    );
  }

  const logs = await prisma.transitionLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      domain: true,
      entityId: true,
      fromState: true,
      toState: true,
      meta: true,
      createdAt: true,
    },
  });

  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
        <p className="text-sm text-slate-400">
          No transition logs found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Domain</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Entity</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">From</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">To</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-800">
            {logs.map((log, idx) => {
              const domainColor = log.domain === "P2P" ? "purple" : "blue";
              return (
                <tr key={log.id} className={`transition-colors hover:bg-slate-700/50 ${idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      domainColor === "purple" 
                        ? "bg-purple-900/50 text-purple-300" 
                        : "bg-blue-900/50 text-blue-300"
                    }`}>
                      {log.domain}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-slate-100">{log.entityId}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-slate-400">{log.fromState}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100">{log.toState}</span>
                      <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
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