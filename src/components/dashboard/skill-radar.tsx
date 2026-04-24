"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";

interface SkillRadarProps {
  skills: { skill: string; value: number }[];
}

const SIZE = 240;
const CENTER = SIZE / 2;
const RINGS = 4;
const MAX_RADIUS = 85;

function polarToCartesian(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

export function SkillRadar({ skills }: SkillRadarProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (skills.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
        <BookOpen className="size-7 text-white/15" />
        <div className="space-y-1">
          <p className="font-mono text-xs text-white/30 uppercase tracking-[0.15em]">Нет данных</p>
          <p className="text-[11px] text-white/20">Пройди курс — навыки появятся здесь</p>
        </div>
      </div>
    );
  }

  const count = skills.length;
  const angleStep = 360 / count;

  const rings = Array.from({ length: RINGS }, (_, i) => {
    const r = (MAX_RADIUS / RINGS) * (i + 1);
    return skills.map((_, j) => {
      const p = polarToCartesian(j * angleStep, r);
      return `${p.x},${p.y}`;
    }).join(" ");
  });

  const axes = skills.map((_, i) => {
    const p = polarToCartesian(i * angleStep, MAX_RADIUS);
    return { x2: p.x, y2: p.y };
  });

  const dataPoints = skills.map((s, i) => {
    const r = (s.value / 100) * MAX_RADIUS;
    return polarToCartesian(i * angleStep, Math.max(r, 4));
  });
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const labels = skills.map((s, i) => {
    const p = polarToCartesian(i * angleStep, MAX_RADIUS + 20);
    return { ...p, text: s.skill, value: s.value, index: i };
  });

  return (
    <div className="flex items-center justify-center relative">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="block overflow-visible"
      >
        {/* Ring polygons */}
        {rings.map((points, i) => (
          <polygon key={i} points={points} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        ))}

        {/* Axis lines */}
        {axes.map((a, i) => (
          <line key={i} x1={CENTER} y1={CENTER} x2={a.x2} y2={a.y2}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        ))}

        {/* Data fill */}
        <polygon
          points={dataPath}
          fill="rgba(16,185,129,0.10)"
          stroke="rgba(16,185,129,0.50)"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Data points + hover zones */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={10} fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            <circle cx={p.x} cy={p.y} r={hovered === i ? 4.5 : 3}
              fill="#10B981"
              opacity={hovered === i ? 1 : 0.75}
              className="transition-all duration-150 pointer-events-none"
            />
          </g>
        ))}

        {/* Labels */}
        {labels.map((l) => (
          <text key={l.index} x={l.x} y={l.y}
            textAnchor="middle" dominantBaseline="middle"
            fill={hovered === l.index ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.40)"}
            fontSize={10} fontFamily="inherit" fontWeight={hovered === l.index ? "600" : "400"}
          >
            {l.text}
          </text>
        ))}

        {/* Tooltip */}
        {hovered !== null && (() => {
          const dp = dataPoints[hovered];
          const s = skills[hovered];
          const tx = dp.x > CENTER ? dp.x - 4 : dp.x + 4;
          const ty = dp.y > CENTER + 10 ? dp.y - 14 : dp.y + 14;
          const anchor = dp.x > CENTER ? "end" : "start";
          return (
            <text x={tx} y={ty} textAnchor={anchor} dominantBaseline="middle"
              fill="#10B981" fontSize={10} fontFamily="inherit" fontWeight="700">
              {s.value}%
            </text>
          );
        })()}
      </svg>
    </div>
  );
}
