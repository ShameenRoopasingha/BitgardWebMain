export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-muted/40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 rounded-xl border border-border/50 bg-card/60"
          />
        ))}
      </div>
      <div className="h-72 rounded-xl border border-border/50 bg-card/60" />
    </div>
  );
}
