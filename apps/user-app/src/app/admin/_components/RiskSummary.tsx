export default function RiskSummary({ data }: any) {
  return (
    <div>
      <SummaryBox label="Stuck On-Ramps" value={data.stuckProcessing.length} />
      <SummaryBox label="Auto-Failed" value={data.successWithoutBalance.length}/>
      <SummaryBox label="Invalid States" value={data.invalidStates.length} />
    </div>
  );
}

function SummaryBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-4 w-48">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
