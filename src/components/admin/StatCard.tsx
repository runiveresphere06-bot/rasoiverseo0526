interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-primary/60">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold text-primary">{value}</p>
      {hint && <p className="mt-1 text-xs text-primary/40">{hint}</p>}
    </div>
  );
}
