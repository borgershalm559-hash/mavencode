function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/[0.06] ${className}`} />;
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      {/* Hero card skeleton */}
      <div className="bg-surface border-2 border-[#10B981]/20" style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}>
        <div className="px-6 py-6 flex items-start gap-5">
          <Pulse className="size-20 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Pulse className="h-5 w-40" />
            <Pulse className="h-3 w-48" />
            <div className="flex gap-2">
              <Pulse className="h-5 w-12" />
              <Pulse className="h-5 w-16" />
              <Pulse className="h-5 w-24" />
            </div>
            <Pulse className="h-1.5 w-64" />
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <Pulse key={i} className="h-5 w-16" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-surface border-2 border-[#10B981]/20" style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}>
            <div className="px-4 py-4 flex items-center gap-3">
              <Pulse className="size-9 flex-shrink-0" />
              <div className="space-y-1.5">
                <Pulse className="h-5 w-10" />
                <Pulse className="h-2 w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Remaining rows skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {[4, 5, 3].map((span, i) => (
          <div key={i} className={`lg:col-span-${span} bg-surface border-2 border-[#10B981]/20`} style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}>
            <div className="px-6 py-6 space-y-3">
              <Pulse className="h-4 w-24" />
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoursesSkeleton() {
  return (
    <div className="space-y-4">
      <Pulse className="h-6 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-surface border-2 border-[#10B981]/20" style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}>
            <div className="px-6 py-6 space-y-3">
              <Pulse className="h-4 w-3/4" />
              <Pulse className="h-3 w-1/2" />
              <Pulse className="h-2 w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NewsSkeleton() {
  return (
    <div className="space-y-3">
      <Pulse className="h-6 w-32" />
      {[1, 2, 3, 4].map((i) => (
        <Pulse key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

export function LibrarySkeleton() {
  return (
    <div className="space-y-4">
      <Pulse className="h-6 w-32" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-surface border-2 border-[#10B981]/20" style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}>
            <div className="px-6 py-6 space-y-3">
              <Pulse className="h-4 w-3/4" />
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
