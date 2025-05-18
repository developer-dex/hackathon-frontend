import React, { useEffect, useRef } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import gsap from "gsap";

interface DayActivity {
  day: string;
  count: number;
  percentage: number;
}

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export interface ActivityHeatmapProps {
  mostActiveDay?: DayActivity;
  dayBreakdown?: DayActivity[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-md shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900">{data.day}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Kudos:</span> {data.count}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Percentage:</span> {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ 
  mostActiveDay,
  dayBreakdown = [] 
}) => {
  const chartRef = useRef(null);

  // If we only have mostActiveDay, create a simulated breakdown
  const data = React.useMemo(() => {
    if (dayBreakdown && dayBreakdown.length > 0) {
      return [...dayBreakdown].sort((a, b) => 
        DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
      );
    }
    
    // If we just have mostActiveDay, create a simulated breakdown
    if (mostActiveDay) {
      const simulatedData: DayActivity[] = DAYS_ORDER.map(day => {
        if (day === mostActiveDay.day) {
          return mostActiveDay;
        }
        // Distribute the remaining percentage randomly among other days
        const remainingPercentage = 100 - mostActiveDay.percentage;
        const estimatedPercentage = Math.round(remainingPercentage / 6 * (0.5 + Math.random()));
        const estimatedCount = Math.round(mostActiveDay.count * estimatedPercentage / mostActiveDay.percentage);
        
        return {
          day,
          count: estimatedCount,
          percentage: estimatedPercentage
        };
      });
      
      // Adjust to ensure percentages add up to 100
      const currentTotal = simulatedData.reduce((sum, day) => sum + day.percentage, 0);
      if (currentTotal !== 100) {
        const adjustment = (100 - currentTotal) / (simulatedData.length - 1);
        simulatedData.forEach(day => {
          if (day.day !== mostActiveDay.day) {
            day.percentage = Math.max(1, Math.round(day.percentage + adjustment));
          }
        });
      }
      
      return simulatedData;
    }
    
    return [];
  }, [mostActiveDay, dayBreakdown]);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      gsap.fromTo(
        ".activity-bar",
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 1,
          stagger: 0.07,
          ease: "elastic.out(1, 0.5)",
          transformOrigin: "bottom",
        }
      );
    }
  }, [data]);

  if (!data.length) {
    return (
      <div className="text-gray-400 text-center py-8 flex flex-col items-center justify-center h-[300px]">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span>No activity data available.</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]" ref={chartRef}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#6B7280', 
              fontWeight: 500,
              fontSize: 12
            }}
          />
          <YAxis 
            hide 
            domain={[0, 'dataMax']} 
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(79, 70, 229, 0.08)' }}
          />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
            className="activity-bar"
          >
            {data.map((entry, index) => {
              // Check if this day is the most active
              const isHighest = entry.day === mostActiveDay?.day;
              
              // Create a gradient based on activity percentage
              const intensity = Math.min(100, 30 + (entry.percentage * 0.7));
              
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isHighest ? `hsl(246, 83%, ${intensity}%)` : `hsl(246, 53%, ${intensity}%)`}
                  stroke={isHighest ? "#4F46E5" : "transparent"}
                  strokeWidth={2}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}; 