"use client";

export function GlassCard({
  children,
  className = "",
  shadow = true,
}: {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
}) {
  return (
    <div className={`relative self-start ${className}`}>
      <div
        className="relative bg-surface border-2 border-white/[0.07] overflow-hidden"
        style={shadow ? { boxShadow: "4px 4px 0 0 rgba(16,185,129,0.35)" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
