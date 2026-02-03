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
      <div className="text-sm text-slate-500">
        No transition logs found.
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Transition Logs</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b text-slate-600">
            <tr>
              <th className="py-2">Domain</th>
              <th>Entity</th>
              <th>From</th>
              <th>To</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="py-2">{log.domain}</td>
                <td>{log.entityId}</td>
                <td className="text-slate-500">{log.fromState}</td>
                <td className="font-medium">{log.toState}</td>
                <td className="text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}