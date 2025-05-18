import React, { useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import gsap from "gsap";

interface DailyActivity {
  date: string;
  count: number;
}

export interface WeeklyActivityTimelineProps {
  dailyActivity?: DailyActivity[];
  weekStart?: string;
  weekEnd?: string;
}

const generateMockData = (startDate: Date, endDate: Date, mostActiveDay: string, totalKudos: number): DailyActivity[] => {
  const result: DailyActivity[] = [];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const currentDate = new Date(startDate);
  const maxCount = totalKudos * 0.3; // Assign 30% of total to most active day
  
  while (currentDate <= endDate) {
    const dayName = dayNames[currentDate.getDay()];
    const isMostActiveDay = dayName === mostActiveDay;
    
    let count;
    if (isMostActiveDay) {
      count = Math.round(maxCount);
    } else {
      // Distribute remaining kudos among other days
      count = Math.round(Math.random() * (totalKudos - maxCount) / 6);
    }
    
    result.push({
      date: currentDate.toISOString().split('T')[0],
      count,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
    
    return (
      <div className="bg-white p-3 rounded-md shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900">{formattedDate}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Kudos:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const WeeklyActivityTimeline: React.FC<WeeklyActivityTimelineProps> = ({
  dailyActivity,
  weekStart,
  weekEnd,
}) => {
  const chartRef = useRef(null);
  
  // Generate or use provided data
  const data = React.useMemo(() => {
    if (dailyActivity && dailyActivity.length > 0) {
      return dailyActivity;
    }
    
    // Use mock data if not provided
    if (weekStart && weekEnd) {
      const startDate = new Date(weekStart);
      const endDate = new Date(weekEnd);
      return generateMockData(startDate, endDate, "Saturday", 79);
    }
    
    // Default week if no dates provided
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return generateMockData(startOfWeek, endOfWeek, "Saturday", 79);
  }, [dailyActivity, weekStart, weekEnd]);
  
  // Animation on mount
  useEffect(() => {
    if (chartRef.current) {
      gsap.from(".activity-area", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }
  }, []);
  
  if (!data.length) {
    return (
      <div className="text-gray-400 text-center py-8 flex flex-col items-center justify-center h-[300px]">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <span>No activity data available.</span>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[300px]" ref={chartRef}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#e2e8f0" 
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#6B7280', 
              fontSize: 12 
            }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { weekday: 'short' });
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: '#94a3b8',
              fontSize: 12
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6366F1"
            fillOpacity={1}
            fill="url(#colorActivity)"
            strokeWidth={2}
            activeDot={{ r: 6, fill: "#4F46E5", stroke: "white", strokeWidth: 2 }}
            className="activity-area"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}; 