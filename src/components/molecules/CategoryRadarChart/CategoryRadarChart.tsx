import React, { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from "recharts";
import { MouseEvent as ReactMouseEvent } from "react";

export interface CategoryRadarChartProps {
  data: Array<{
    name: string;
    count: number;
    id?: string;
  }>;
}

const COLORS = {
  radar: "rgba(99, 102, 241, 0.7)",
  grid: "#e2e8f0", 
  hover: "rgba(79, 70, 229, 0.9)",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Count:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = (props: any, e: ReactMouseEvent<SVGPolygonElement, MouseEvent>) => {
    setActiveIndex(0); // Update as needed to identify the active element
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Normalize data for better radar chart visualization
  const normalizedData = data.map(item => {
    return {
      ...item,
      fullMark: Math.max(...data.map(d => d.count)) * 1.2, // For scaling
    };
  });

  if (!data.length) {
    return (
      <div className="text-gray-400 text-center py-8 flex flex-col items-center justify-center h-[300px]">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
        </svg>
        <span>No category data available.</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius="80%" 
          data={normalizedData}
          margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
        >
          <PolarGrid 
            stroke={COLORS.grid} 
            strokeDasharray="3 3" 
          />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ 
              fill: '#6B7280', 
              fontSize: 12 
            }}
            tickLine={false}
          />
          <PolarRadiusAxis 
            stroke="#cbd5e1" 
            tick={{ 
              fill: '#94a3b8',
              fontSize: 10
            }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Categories"
            dataKey="count"
            stroke="#4F46E5"
            fill={COLORS.radar}
            fillOpacity={0.6}
            dot={{ 
              r: 4, 
              fill: "white", 
              stroke: "#4F46E5", 
              strokeWidth: 2 
            }}
            activeDot={{ 
              r: 6, 
              fill: "#4F46E5", 
              stroke: "white", 
              strokeWidth: 2,
              fillOpacity: 1
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <span className="text-sm font-medium text-gray-700">{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}; 