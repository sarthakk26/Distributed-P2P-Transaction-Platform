export default function RiskSummary({ data }: any) {
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
  const getBorderColor = () => {
    if (value === 0) return 'border-slate-200 bg-white';
    
    switch(color) {
      case 'red':
        return 'border-red-500 bg-red-50';
      case 'orange':
        return 'border-orange-500 bg-orange-50';
      case 'yellow':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  const getTextColor = () => {
    if (value === 0) return 'text-slate-700';
    
    switch(color) {
      case 'red':
        return 'text-red-700';
      case 'orange':
        return 'text-orange-700';
      case 'yellow':
        return 'text-yellow-700';
      default:
        return 'text-slate-700';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-4 transition-colors ${getBorderColor()}`}>
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${getTextColor()}`}>
        {value}
      </p>
      {value === 0 && (
        <p className="text-xs text-green-600 mt-1">✓ All clear</p>
      )}
    </div>
  );
}