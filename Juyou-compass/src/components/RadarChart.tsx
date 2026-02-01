import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { WuXing } from '../types';

interface Props {
  data: WuXing;
  color?: string;
}

const RadarChartComponent: React.FC<Props> = ({ data, color = "#F97316" }) => {
  const chartData = [
    { subject: '木', A: data.wood, fullMark: 100 },
    { subject: '火', A: data.fire, fullMark: 100 },
    { subject: '土', A: data.earth, fullMark: 100 },
    { subject: '金', A: data.metal, fullMark: 100 },
    { subject: '水', A: data.water, fullMark: 100 },
  ];

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
          />
          <Radar
            name="Energy"
            dataKey="A"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.2}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;