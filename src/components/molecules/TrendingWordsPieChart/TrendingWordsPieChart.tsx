import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingCategory } from "@/domain/models/analytics";

const COLORS = [
  "#6EC6FF",
  "#FF8A65",
  "#FFD54F",
  "#81C784",
  "#BA68C8",
  "#4DD0E1",
  "#FFB74D",
  "#9575CD",
  "#4FC3F7",
  "#F06292",
];

export interface TrendingWordsPieChartProps {
  data: TrendingCategory[] | undefined;
}

export const TrendingWordsPieChart: React.FC<TrendingWordsPieChartProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        No trending words data available.
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
      <div className="text-gray-400 text-center py-8">
        No trending words data available.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={filteredData}
            dataKey="score"
            nameKey="word"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
            labelLine={false}
            activeShape={{ stroke: "none" }}
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
