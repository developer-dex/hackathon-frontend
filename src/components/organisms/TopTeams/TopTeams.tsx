import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CHART_HEIGHT = 150;
const Y_TICKS = 4;

interface ITopTeamsProps {
  data: { name: string; count: number }[];
  maxY?: number;
}

export const TopTeams: React.FC<ITopTeamsProps> = ({ data, maxY = 60 }) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const countsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    name: string;
    count: number;
  }>({ visible: false, x: 0, y: 0, name: "", count: 0 });

  useEffect(() => {
    if (barsRef.current) {
      gsap.fromTo(
        barsRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          stagger: 0.12,
          transformOrigin: "bottom",
          ease: "bounce.out",
        }
      );
    }
    if (countsRef.current) {
      gsap.fromTo(
        countsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.7,
          stagger: 0.12,
          ease: "power2.out",
        }
      );
    }
  }, [data]);

  // Sort data by count descending and limit to top 5
  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Use maxY for axis and bar scaling
  const yLabels = Array.from({ length: Y_TICKS + 1 }, (_, i) =>
    Math.round((maxY * (Y_TICKS - i)) / Y_TICKS)
  );

  const handleBarMouseEnter = (
    e: React.MouseEvent,
    team: { name: string; count: number }
  ) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      name: team.name,
      count: team.count,
    });
  };
  const handleBarMouseLeave = () =>
    setTooltip((t) => ({ ...t, visible: false }));

  return (
    <div className="h-full w-full">
      <div className="flex flex-row items-end relative h-full">
        <div className="relative w-9 mr-2 h-[150px] flex flex-col justify-between">
          {yLabels.map((label, i) => (
            <div
              key={i}
              className="absolute left-0 w-full text-sm text-gray-400 text-right transform translate-y-1/2 pointer-events-none select-none"
              style={{
                bottom: `${((Y_TICKS - i) * CHART_HEIGHT) / Y_TICKS}px`,
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="relative flex-1 h-[150px] flex items-end bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl px-3">
          {/* Grid lines */}
          {yLabels.map((_, i) => (
            <div
              key={i}
              className="absolute left-0 w-full h-px bg-gradient-to-r from-indigo-100 to-indigo-50 opacity-70 z-0 pointer-events-none"
              style={{
                bottom: `${((Y_TICKS - i) * CHART_HEIGHT) / Y_TICKS}px`,
              }}
            />
          ))}
          <div className="grid grid-cols-5 w-full relative z-10">
            {sortedData.map((team, idx) => (
              <div
                key={team.name}
                className="flex flex-col justify-end items-center"
              >
                <span
                  className="text-base font-semibold text-pink-400 mb-1 text-center"
                  ref={(el) => {
                    countsRef.current[idx] = el;
                  }}
                >
                  {team.count}
                </span>
                <div
                  className="w-9 bg-gradient-to-b from-pink-400 to-pink-300 rounded-t-lg transition-all duration-200 shadow-lg shadow-pink-200/20 cursor-pointer hover:brightness-110 hover:shadow-xl hover:shadow-pink-200/30 hover:scale-105"
                  ref={(el) => {
                    barsRef.current[idx] = el;
                  }}
                  style={{
                    height: `${(team.count / maxY) * CHART_HEIGHT}px`,
                  }}
                  onMouseEnter={(e) => handleBarMouseEnter(e, team)}
                  onMouseLeave={handleBarMouseLeave}
                />
              </div>
            ))}
            {tooltip.visible && (
              <div
                className="fixed z-50 bg-white text-gray-800 rounded-lg shadow-lg shadow-indigo-200/20 p-2.5 px-4 text-base font-medium pointer-events-none transform -translate-x-1/2 -translate-y-[110%] whitespace-nowrap border border-indigo-50/50 opacity-95"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                <strong>{tooltip.name}</strong>
                <br />
                Kudos: <span>{tooltip.count}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
