export default function P2PRiskSummary({ summary }: any) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryBox 
        label="Stuck Locked Transfers" 
        value={summary.stuckLockedTransfers} 
        color="red"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <SummaryBox 
        label="Failed w/ Locked Balance" 
        value={summary.failedWithLockedBalance}
        color="orange"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />
      <SummaryBox 
        label="Invalid Locked State" 
        value={summary.invalidLockedState}
        color="yellow"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <SummaryBox 
        label="Negative Balances" 
        value={summary.negativeBalances}
        color="red"
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />
    </div>
  );
}

function SummaryBox({ 
  label, 
  value, 
  color,
  icon
}: { 
  label: string; 
  value: number;
  color: 'red' | 'orange' | 'yellow';
  icon: React.ReactNode;
}) {
  const isHealthy = value === 0;
  
  const colorClasses = {
    red: {
      border: isHealthy ? 'border-slate-700' : 'border-red-500/50',
      bg: isHealthy ? 'bg-slate-800' : 'bg-red-950/30',
      text: isHealthy ? 'text-slate-300' : 'text-red-400',
      iconBg: isHealthy ? 'bg-slate-700' : 'bg-red-900/30',
      iconText: isHealthy ? 'text-slate-400' : 'text-red-400',
      badge: 'bg-red-900/50 text-red-300'
    },
    orange: {
      border: isHealthy ? 'border-slate-700' : 'border-orange-500/50',
      bg: isHealthy ? 'bg-slate-800' : 'bg-orange-950/30',
      text: isHealthy ? 'text-slate-300' : 'text-orange-400',
      iconBg: isHealthy ? 'bg-slate-700' : 'bg-orange-900/30',
      iconText: isHealthy ? 'text-slate-400' : 'text-orange-400',
      badge: 'bg-orange-900/50 text-orange-300'
    },
    yellow: {
      border: isHealthy ? 'border-slate-700' : 'border-yellow-500/50',
      bg: isHealthy ? 'bg-slate-800' : 'bg-yellow-950/30',
      text: isHealthy ? 'text-slate-300' : 'text-yellow-400',
      iconBg: isHealthy ? 'bg-slate-700' : 'bg-yellow-900/30',
      iconText: isHealthy ? 'text-slate-400' : 'text-yellow-400',
      badge: 'bg-yellow-900/50 text-yellow-300'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`rounded-xl border-2 p-5 shadow-sm transition-all hover:shadow-md ${classes.border} ${classes.bg}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
            {label}
          </p>
          <p className={`text-3xl font-bold ${classes.text}`}>
            {value}
          </p>
          {isHealthy ? (
            <div className="mt-3 flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium text-green-400">All clear</p>
            </div>
          ) : (
            <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${classes.badge}`}>
              Action needed
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${classes.iconBg}`}>
          <div className={classes.iconText}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}