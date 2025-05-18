import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { TrendingCategory } from "@/domain/models/analytics";

// Updated modern color palette that's more vibrant and cohesive
const COLORS = [
  "#4F46E5", // indigo-600
  "#7C3AED", // violet-600
  "#2563EB", // blue-600
  "#0891B2", // cyan-600
  "#059669", // emerald-600
  "#16A34A", // green-600
  "#CA8A04", // yellow-600
  "#EA580C", // orange-600
  "#DC2626", // red-600
  "#DB2777", // pink-600
];

export interface TrendingWordsPieChartProps {
  data: TrendingCategory[] | undefined;
}

// Custom active shape for better interactive visualization
const renderActiveShape = (props: any) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value 
  } = props;
  
  return (
    <g>
      <text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill="#888">
        {payload.word}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fontWeight="bold" fill="#333">
        {value}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 12}
        fill={fill}
      />
    </g>
  );
};

// Custom legend that matches bar chart style
const CustomLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <ul className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-1">
          <div 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium text-gray-600">
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

// Custom tooltip that matches dashboard style
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Score:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const TrendingWordsPieChart: React.FC<TrendingWordsPieChartProps> = ({
  data,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8 flex flex-col items-center justify-center h-[300px]">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>No trending words data available.</span>
      </div>
    );
  }

  // Support both {word, score} and {name, count}
  const mappedData = data.map((item: any) => ({
    word: item.word || item.name,
    score: typeof item.score === "number" ? item.score : Number(item.count),
  }));

  // Filter out items with invalid or zero score
  const filteredData = mappedData.filter((item) => item.word && item.score > 0);

  if (filteredData.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8 flex flex-col items-center justify-center h-[300px]">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>No trending words data available.</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[340px] p-2">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={filteredData}
            dataKey="score"
            nameKey="word"
            cx="50%"
            cy="45%" 
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            onMouseEnter={onPieEnter}
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={2}
                
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
