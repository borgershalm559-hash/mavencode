"use client";

import { useState, useMemo } from "react";
import { Flame, CalendarDays, Zap } from "lucide-react";

interface ActivityHeatmapProps {
  activity: Record<string, number>;
  streak: number;
}

const CELL_SIZE = 16;
const GAP = 4;
const WEEKS = 52;
const DAYS = 7;
const DAY_LABELS = ["Пн", "", "Ср", "", "Пт", "", ""];
const MONTH_LABELS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

function getColor(count: number, isCurrentWeek: boolean): string {
  const boost = isCurrentWeek ? 0.1 : 0;
  if (count === 0) return isCurrentWeek ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)";
  if (count <= 1) return `rgba(16,185,129,${0.18 + boost})`;
  if (count <= 2) return `rgba(16,185,129,${0.35 + boost})`;
  if (count <= 4) return `rgba(16,185,129,${0.55 + boost})`;
  return `rgba(16,185,129,${0.80 + boost})`;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatRuDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function getBestWeek(grid: { date: string; count: number; week: number; day: number }[]): number {
  const weekTotals = new Map<number, number>();
  for (const cell of grid) {
    weekTotals.set(cell.week, (weekTotals.get(cell.week) ?? 0) + cell.count);
  }
  return Math.max(0, ...weekTotals.values());
}

export function ActivityHeatmap({ activity, streak }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

  const { grid, months, totalCount, bestWeek, todayStr } = useMemo(() => {
    const today = new Date();
    const todayKey = formatDate(today);
    const cells: { date: string; count: number; week: number; day: number }[] = [];

    const start = new Date(today);
    start.setDate(start.getDate() - (WEEKS * 7 - 1));
    const dayOfWeek = start.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    start.setDate(start.getDate() + mondayOffset);

    let total = 0;
    const monthPositions: { label: string; x: number }[] = [];
    let lastMonth = -1;

    const cursor = new Date(start);
    for (let week = 0; week < WEEKS; week++) {
      for (let day = 0; day < DAYS; day++) {
        const key = formatDate(cursor);
        const count = activity[key] || 0;
        total += count;

        if (cursor.getMonth() !== lastMonth && day === 0) {
          monthPositions.push({ label: MONTH_LABELS[cursor.getMonth()], x: week });
          lastMonth = cursor.getMonth();
        }

        if (cursor <= today) {
          cells.push({ date: key, count, week, day });
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return {
      grid: cells,
      months: monthPositions,
      totalCount: total,
      bestWeek: getBestWeek(cells),
      todayStr: todayKey,
    };
  }, [activity]);

  const currentWeekIdx = Math.max(...grid.map((c) => c.week));

  const svgWidth = WEEKS * (CELL_SIZE + GAP) + 30;
  const svgHeight = DAYS * (CELL_SIZE + GAP) + 24;

  const legendValues = [0, 1, 2, 4, 5];

  return (
    <div className="space-y-4">
      {/* Heatmap */}
      <div className="relative">
        <div className="overflow-x-auto hide-scrollbar">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="block"
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Month labels */}
            {months.map((m, i) => (
              <text key={i} x={30 + m.x * (CELL_SIZE + GAP)} y={10}
                fill="rgba(255,255,255,0.30)" fontSize={11} fontFamily="inherit">
                {m.label}
              </text>
            ))}

            {/* Day labels */}
            {DAY_LABELS.map((label, i) =>
              label ? (
                <text key={i} x={0} y={24 + i * (CELL_SIZE + GAP) + CELL_SIZE / 2 + 3}
                  fill="rgba(255,255,255,0.25)" fontSize={11} fontFamily="inherit">
                  {label}
                </text>
              ) : null
            )}

            {/* Grid cells */}
            {grid.map((cell) => {
              const isToday = cell.date === todayStr;
              const isCurrentWeek = cell.week === currentWeekIdx;
              const cx = 30 + cell.week * (CELL_SIZE + GAP);
              const cy = 18 + cell.day * (CELL_SIZE + GAP);

              return (
                <g key={cell.date}>
                  <rect
                    x={cx} y={cy}
                    width={CELL_SIZE} height={CELL_SIZE}
                    rx={1.5}
                    fill={getColor(cell.count, isCurrentWeek)}
                    className="transition-colors duration-150 cursor-pointer"
                    onMouseEnter={(e) => {
                      const rect = (e.target as SVGRectElement).getBoundingClientRect();
                      const parent = (e.target as SVGRectElement).closest("div")!.getBoundingClientRect();
                      setTooltip({
                        x: rect.left - parent.left + rect.width / 2,
                        y: rect.top - parent.top - 8,
                        date: cell.date,
                        count: cell.count,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                  {/* Today ring */}
                  {isToday && (
                    <rect
                      x={cx} y={cy}
                      width={CELL_SIZE} height={CELL_SIZE}
                      rx={1.5}
                      fill="none"
                      stroke="rgba(16,185,129,0.8)"
                      strokeWidth={1.5}
                      className="pointer-events-none"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-50 px-3 py-2 bg-surface border-2 border-[#10B981]/20 shadow-[4px_4px_0_0_rgba(16,185,129,0.25)] text-sm whitespace-nowrap -translate-x-1/2 -translate-y-full"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <span className="text-[#10B981] font-semibold font-mono">{tooltip.count}</span>
            <span className="text-white/50"> активн. — </span>
            <span className="text-white/70">{formatRuDate(tooltip.date)}</span>
          </div>
        )}
      </div>

      {/* Divider + bottom row */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-white/[0.06]">

        {/* 3 mini-stats */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="size-7 bg-[#10B981]/[0.08] border border-[#10B981]/15 flex items-center justify-center">
              <Zap className="size-3.5 text-[#10B981]/60" />
            </div>
            <div>
              <div className="text-white text-sm font-bold leading-none">{totalCount}</div>
              <div className="font-mono text-white/30 text-[10px] uppercase tracking-[0.15em] mt-0.5">Всего</div>
            </div>
          </div>

          <div className="w-px h-6 bg-white/[0.07]" />

          <div className="flex items-center gap-2">
            <div className="size-7 bg-orange-500/[0.08] border border-orange-500/15 flex items-center justify-center">
              <Flame className="size-3.5 text-orange-500/60" />
            </div>
            <div>
              <div className="text-white text-sm font-bold leading-none">{streak} дн.</div>
              <div className="font-mono text-white/30 text-[10px] uppercase tracking-[0.15em] mt-0.5">Серия</div>
            </div>
          </div>

          <div className="w-px h-6 bg-white/[0.07]" />

          <div className="flex items-center gap-2">
            <div className="size-7 bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
              <CalendarDays className="size-3.5 text-white/30" />
            </div>
            <div>
              <div className="text-white text-sm font-bold leading-none">{bestWeek}</div>
              <div className="font-mono text-white/30 text-[10px] uppercase tracking-[0.15em] mt-0.5">Рекорд/нед.</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5">
          {legendValues.map((v) => (
            <div
              key={v}
              className="size-3"
              style={{ background: getColor(v, false) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
