export default function P2PRiskSummary({ summary }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryBox 
        label="Stuck Locked Transfers" 
        value={summary.stuckLockedTransfers} 
        color="red"
      />
      <SummaryBox 
        label="Failed w/ Locked Balance" 
        value={summary.failedWithLockedBalance}
        color="orange"
      />
      <SummaryBox 
        label="Invalid Locked State" 
        value={summary.invalidLockedState}
        color="yellow"
      />
      <SummaryBox 
        label="Negative Balances" 
        value={summary.negativeBalances}
        color="red"
      />
    </div>
  );
}

function SummaryBox({ 
  label, 
  value, 
  color 
}: { 
  label: string; 
  value: number;
  color: 'red' | 'orange' | 'yellow';
}) {
  const colorClasses = {
    red: value > 0 ? 'border-red-500 bg-red-50' : 'border-slate-200',
    orange: value > 0 ? 'border-orange-500 bg-orange-50' : 'border-slate-200',
    yellow: value > 0 ? 'border-yellow-500 bg-yellow-50' : 'border-slate-200',
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${colorClasses[color]}`}>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-3xl font-bold mt-1">
        {value}
      </p>
    </div>
  );
}