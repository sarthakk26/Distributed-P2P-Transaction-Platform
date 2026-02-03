export default function OnRampRiskSummary({ data }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryBox 
        label="Stuck On-Ramps" 
        value={data.stuckProcessing.length}
        color="red"
      />
      <SummaryBox 
        label="Success w/o Balance" 
        value={data.successWithoutBalance.length}
        color="orange"
      />
      <SummaryBox 
        label="Invalid States" 
        value={data.invalidStates.length}
        color="yellow"
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
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}