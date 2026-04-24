import { sections } from "./data";

interface SectionHeaderProps {
  active: string;
}

export function SectionHeader({ active }: SectionHeaderProps) {
  const section = sections.find((s) => s.key === active);
  const Icon = section?.icon;

  return (
    <div className="flex items-center gap-3 pb-2 mb-2 border-b-2 border-white/[0.07]">
      {Icon && <Icon className="size-5 text-[#10B981]" />}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          / {section?.key}
        </div>
        <h2 className="font-mono text-base font-bold uppercase tracking-[0.3em] text-white/90">
          {section?.label}
        </h2>
      </div>
    </div>
  );
}
