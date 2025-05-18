import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface ComparisonData {
  previous: number;
  percentageChange: number;
}

export interface PeriodComparisonProps {
  totalKudos?: ComparisonData;
  avgKudosPerPerson?: ComparisonData;
  currentTotalKudos?: number;
  currentAvgKudos?: number;
}

export const PeriodComparisonChart: React.FC<PeriodComparisonProps> = ({
  totalKudos,
  avgKudosPerPerson,
  currentTotalKudos,
  currentAvgKudos,
}) => {
  const percentageRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    // Animate numbers counting up
    if (percentageRefs.current.length) {
      percentageRefs.current.forEach((el, index) => {
        if (!el) return;
        
        const percentValue = index === 0 
          ? totalKudos?.percentageChange || 0 
          : avgKudosPerPerson?.percentageChange || 0;
        
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: Math.round(percentValue),
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            delay: 0.3 + index * 0.2,
          }
        );
      });
    }
    
    // Animate bars filling up
    if (barRefs.current.length) {
      barRefs.current.forEach(el => {
        if (!el) return;
        
        gsap.fromTo(
          el,
          { width: 0 },
          {
            width: "100%",
            duration: 1.5,
            ease: "power2.inOut",
          }
        );
      });
    }
  }, [totalKudos, avgKudosPerPerson]);
  
  if (!totalKudos && !avgKudosPerPerson) {
    return (
      <div className="text-gray-400 text-center py-8 flex flex-col items-center justify-center h-[300px]">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>
        <span>No comparison data available.</span>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-8">
      {totalKudos && (
        <div className="relative">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Total Kudos</h3>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span ref={el => { percentageRefs.current[0] = el; }}>0</span>%
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">{currentTotalKudos}</span>
          </div>
          
          {/* Current period bar */}
          <div className="h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
            <div 
              ref={el => { barRefs.current[0] = el; }} 
              className="h-full w-full"
            ></div>
          </div>
          
          {/* Previous period bar */}
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mt-2 overflow-hidden" style={{ width: `${Math.min(100, 100 / (totalKudos.percentageChange / 100 + 1))}%` }}>
            <div className="h-full w-full"></div>
          </div>
          
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500 font-medium">Previous: {totalKudos.previous}</span>
            <span className="text-gray-500 font-medium">Current: {currentTotalKudos || 0}</span>
          </div>
        </div>
      )}
      
      {avgKudosPerPerson && (
        <div className="relative">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Avg. Kudos per Person</h3>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span ref={el => { percentageRefs.current[1] = el; }}>0</span>%
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">{currentAvgKudos}</span>
          </div>
          
          {/* Current period bar */}
          <div className="h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg overflow-hidden">
            <div 
              ref={el => { barRefs.current[1] = el; }} 
              className="h-full w-full"
            ></div>
          </div>
          
          {/* Previous period bar */}
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mt-2 overflow-hidden" style={{ width: `${Math.min(100, 100 / (avgKudosPerPerson.percentageChange / 100 + 1))}%` }}>
            <div className="h-full w-full"></div>
          </div>
          
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500 font-medium">Previous: {avgKudosPerPerson.previous}</span>
            <span className="text-gray-500 font-medium">Current: {currentAvgKudos || 0}</span>
          </div>
        </div>
      )}
    </div>
  );
}; 