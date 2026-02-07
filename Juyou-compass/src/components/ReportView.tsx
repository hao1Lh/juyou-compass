import React, { useState } from 'react';
import { User, MapPin, Sparkles, AlertTriangle, ListChecks, Share2, Compass, Ban, Users, ShieldAlert, Footprints, Zap, Lock } from 'lucide-react';
import { ReportData, UserInputs } from '../types';
import RadarChartComponent from './RadarChart';
import Paywall from './Paywall';

interface Props {
  result: ReportData;
  inputs: UserInputs;
  onReset: () => void;
}

const ReportView: React.FC<Props> = ({ result, inputs, onReset }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const purposeMap: Record<string, string> = {
      'explore': '探索',
      'healing': '疗愈',
      'career': '事业',
      'social': '社交',
      'inspiration': '灵感'
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-[#FDFBF7] pb-20 pt-10 px-6 font-serif text-stone-800 selection:bg-orange-100">
      {/* --- Header: Lab Style Ticket --- */}
      <header className="border-b-2 border-stone-900 pb-6 mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-stone-900">Juyou Lab</h1>
          <p className="text-xs font-mono text-stone-500 tracking-widest uppercase">Travel Energy Compass v2.1</p>
        </div>
        <div className="text-right font-mono text-xs text-stone-500 leading-tight">
          <div>{inputs.targetCity.toUpperCase()}</div>
          <div>MODE: {purposeMap[inputs.tripPurpose] || 'HYBRID'}</div>
          <div>REF: {Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
        </div>
      </header>

      {/* --- Section 1: Social Badge --- */}
      <section className="mb-12 relative group cursor-pointer">
        <div className="absolute inset-0 bg-stone-900 transform translate-x-2 translate-y-2 rounded-sm"></div>
        <div className="relative bg-[#FFFBF0] border-2 border-stone-900 p-8 rounded-sm text-center overflow-hidden">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <Sparkles size={180} />
            </div>
            
            <div className="inline-block border border-stone-900 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase mb-4 bg-white">
                Energy Identity
            </div>
            
            <h2 className="text-4xl font-bold text-stone-900 mb-2 leading-tight">
                {result.social_badge.title}
            </h2>
            
            <div className="flex justify-center gap-4 text-xs font-mono text-stone-500 mb-6 uppercase tracking-wider">
                {result.social_badge.keywords.map((k, i) => (
                    <span key={i} className="border-b border-stone-300 pb-1">#{k}</span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-dashed border-stone-300 pt-6 mt-2 max-w-xs mx-auto">
                <div>
                    <div className="text-[10px] text-stone-400 uppercase font-mono mb-1">Lucky Direction</div>
                    <div className="font-bold">{result.social_badge.auspicious_direction}</div>
                </div>
                <div>
                    <div className="text-[10px] text-stone-400 uppercase font-mono mb-1">Aura Color</div>
                    <div className="font-bold flex items-center justify-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: 'orange' }}></span>
                        {result.social_badge.lucky_color}
                    </div>
                </div>
            </div>
        </div>
        <div className="text-center mt-3 text-xs text-stone-400 font-mono flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Share2 size={12} /> 点击截图保存你的能量符
        </div>
      </section>

      {/* --- Section 2: Personal Analysis --- */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-stone-300 flex-1"></div>
            <h3 className="text-lg font-bold text-stone-900 italic font-serif">01. 命理共鸣</h3>
            <div className="h-px bg-stone-300 flex-1"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
                <div className="mb-4">
                    <span className="text-4xl font-bold text-stone-900 mr-3 font-mono">{result.user_profile.match_score}</span>
                    <span className="text-sm text-stone-500 uppercase font-mono">Compatibility Score</span>
                </div>
                <p className="text-base text-stone-700 leading-relaxed mb-4 text-justify">
                    {result.user_profile.match_comment}
                </p>
                <div className="bg-stone-100 p-4 rounded-sm border-l-2 border-stone-400">
                    <div className="text-xs font-bold text-stone-500 uppercase mb-1">Your Core Energy</div>
                    <div className="text-lg font-bold text-stone-800">{result.user_profile.energy_type}</div>
                </div>
            </div>
            <div className="relative">
                <RadarChartComponent data={result.user_profile.wuxing} color="#1c1917" />
                <div className="text-center text-[10px] text-stone-400 font-mono mt-2">WU-XING CHART</div>
            </div>
        </div>
      </section>

      {/* --- Section 3: Lab Analysis (Symmetrical Grid) --- */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-stone-300 flex-1"></div>
            <h3 className="text-lg font-bold text-stone-900 italic font-serif">02. 磁场维度</h3>
            <div className="h-px bg-stone-300 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            {result.dest_analysis.dimensions.map((dim, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-stone-200 min-w-0">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="font-bold text-stone-800 truncate pr-2">{dim.name}</span>
                        <span className="font-mono text-sm text-stone-400 whitespace-nowrap">{dim.val}/10</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 mb-2 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-800" style={{ width: `${dim.val * 10}%` }}></div>
                    </div>
                    <p className="text-xs text-stone-500 leading-tight">{dim.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* --- Section 4: Strategic Deep Dive (Premium) --- */}
      <section className="relative">
        <div className="flex items-center gap-3 mb-8">
            <div className="h-px bg-stone-300 flex-1"></div>
            <h3 className="text-lg font-bold text-stone-900 italic font-serif">03. 城市能量场分析报告</h3>
            <div className="h-px bg-stone-300 flex-1"></div>
        </div>

        <div className={`transition-all duration-700 space-y-8 ${!isUnlocked ? 'filter blur-xl opacity-20 select-none pointer-events-none grayscale' : ''}`}>
            
            {/* 1. Deep Risk Analysis */}
            <div className="bg-white border-l-4 border-red-500 pl-6 py-2 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert size={18} className="text-red-500" />
                    <h4 className="font-bold text-stone-900 text-lg">核心风险与对冲策略</h4>
                </div>
                
                <div className="mb-4">
                    <h5 className="text-xs font-bold text-stone-400 uppercase mb-1">Risk Analysis</h5>
                    <p className="text-stone-700 text-sm leading-relaxed">{result.paid_content.pitfalls.risk_analysis}</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-sm border border-red-100">
                    <h5 className="text-xs font-bold text-red-500 uppercase mb-2">Mitigation Strategy</h5>
                    <p className="text-stone-800 text-sm font-medium leading-relaxed">{result.paid_content.pitfalls.mitigation_strategy}</p>
                </div>
            </div>

            {/* 2. Strategic Roadmap */}
            <div>
                 <div className="flex items-center gap-2 mb-6">
                    <Footprints size={18} className="text-stone-900" />
                    <h4 className="font-bold text-stone-900 text-lg">三阶段行动蓝图</h4>
                </div>
                
                <div className="space-y-0 relative border-l border-stone-200 ml-3">
                    {result.paid_content.roadmap.map((stage, i) => (
                        <div key={i} className="mb-8 pl-8 relative">
                            {/* Dot */}
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-stone-900 border-2 border-[#FDFBF7]"></div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider">{stage.stage_name}</span>
                                <span className="font-bold text-stone-900">{stage.action_title}</span>
                            </div>
                            <p className="text-sm text-stone-600 leading-relaxed">
                                {stage.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Cheat Code */}
            <div className="bg-stone-900 text-[#FDFBF7] p-6 rounded-sm shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
                
                <div className="flex items-start gap-3 relative z-10">
                    <Zap size={24} className="text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                        <div className="text-xs font-mono text-orange-500 uppercase tracking-widest mb-1">Local Hack / 在地文化思维</div>
                        <h4 className="text-lg font-bold mb-3">{result.paid_content.cheat_code.title}</h4>
                        <p className="text-sm text-stone-300 leading-relaxed font-light opacity-90">
                            {result.paid_content.cheat_code.content}
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. Locations */}
            <div className="border border-dashed border-stone-300 p-4 rounded-sm flex flex-col sm:flex-row gap-4 sm:items-center">
                 <div className="flex items-center gap-2 text-stone-500 font-mono text-xs whitespace-nowrap">
                    <MapPin size={14} /> 能量锚点
                </div>
                <div className="flex flex-wrap gap-2">
                    {result.paid_content.lucky_spots.spots.map((spot, i) => (
                        <span key={i} className="bg-white border border-stone-200 text-stone-600 px-3 py-1 text-xs shadow-sm">
                            {spot}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {!isUnlocked && <Paywall onUnlock={() => setIsUnlocked(true)} />}
      </section>

      <div className="mt-16 pt-8 border-t border-stone-200 text-center">
         {/* Social Proof */}
         <div className="flex items-center justify-center gap-2 text-stone-500 text-xs font-mono mb-4 animate-pulse">
            <Users size={12} />
            <span>已有 6,450 位游民解锁了分析报告</span>
         </div>
         
         <button onClick={onReset} className="font-bold text-xs text-stone-900 hover:text-orange-600 flex items-center justify-center gap-2 mx-auto uppercase tracking-widest transition-colors border border-stone-900 px-6 py-3 rounded-sm hover:bg-stone-900 hover:text-white">
            <Compass size={14} /> 开启新的时空序列 / INITIALIZE NEW SEQUENCE
         </button>
      </div>
    </div>
  );
};

export default ReportView;
