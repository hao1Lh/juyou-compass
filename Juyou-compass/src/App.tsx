import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, MapPin, Target, User, Brain } from 'lucide-react';
import ReportView from './components/ReportView';
import { generateReport } from './services/geminiService';
import { ReportData, AppState } from './types';

// Loading messages sequence
const LOADING_MSGS = [
  "正在连接时空能量场...",
  "读取当地经纬度磁场...",
  "解析先天五行命盘...",
  "推演天干地支交互...",
  "正在生成避坑指南...",
  "能量聚合中...",
];

export default function App() {
  const [state, setState] = useState<AppState>({
    step: 'input',
    inputs: { 
        targetCity: '', 
        tripPurpose: 'explore', // Default
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        mbti: ''
    },
    result: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Loading Animation Logic
  useEffect(() => {
    let interval: any;
    if (isLoading) {
        setLoadingMsgIndex(0);
        interval = setInterval(() => {
            setLoadingMsgIndex(prev => (prev + 1) % LOADING_MSGS.length);
        }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleInputChange = (field: keyof AppState['inputs'], value: string) => {
    setState(prev => ({
        ...prev,
        inputs: { ...prev.inputs, [field]: value }
    }));
  };

  const handleStart = async () => {
    const { targetCity, tripPurpose, birthDate, birthPlace } = state.inputs;
    if (!targetCity || !tripPurpose || !birthDate || !birthPlace) {
      alert("请填写必填项：目的地、旅居目的、出生日期、出生地点");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setState(prev => ({ ...prev, step: 'loading' }));

    try {
      const result = await generateReport(state.inputs);
      setState(prev => ({ ...prev, step: 'report', result }));
    } catch (e) {
      console.error(e);
      setErrorMsg("能量连接中断，请检查网络设置。");
      setState(prev => ({ ...prev, step: 'input' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, step: 'input', result: null }));
    setErrorMsg(null);
  };

  // 1. Loading View (Sequenced)
  if (state.step === 'loading') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center font-serif">
        <div className="relative w-24 h-24 mb-10">
          <div className="absolute inset-0 border border-stone-200 rounded-full opacity-50 scale-110"></div>
          <div className="absolute inset-0 border border-stone-300 rounded-full opacity-50 scale-125"></div>
          
          {/* Rotating Rings */}
          <div className="absolute inset-0 border-2 border-stone-900 border-t-transparent rounded-full animate-spin duration-[3s]"></div>
          <div className="absolute inset-2 border-2 border-orange-600 border-b-transparent rounded-full animate-spin duration-[2s] direction-reverse"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-2xl animate-pulse">☯</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-stone-900 mb-4 tracking-wider">
            {LOADING_MSGS[loadingMsgIndex]}
        </h2>
        <div className="w-48 h-1 bg-stone-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-stone-900 animate-progress"></div>
        </div>
        <p className="mt-4 text-xs font-mono text-stone-400">Juyou Lab Processing Unit</p>
      </div>
    );
  }

  // 2. Report View
  if (state.step === 'report' && state.result) {
    return <ReportView result={state.result} inputs={state.inputs} onReset={handleReset} />;
  }

  // 3. Input View (Zen Lab Form)
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-stone-800">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-10">
            <div className="inline-block border-2 border-stone-900 p-4 rounded-sm mb-4 bg-white relative">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></div>
                <Compass size={32} className="text-stone-900" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-1">Juyou Lab</h1>
            <p className="text-xs font-mono tracking-[0.2em] text-stone-500 uppercase">城市能量罗盘</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-stone-200 p-8 shadow-xl shadow-stone-200/50 rounded-sm relative overflow-hidden">
            {/* Zen Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-stone-900"></div>
            
            {errorMsg && (
                <div className="bg-red-50 text-red-600 text-xs p-3 mb-6 border-l-2 border-red-500 font-mono">
                    ERROR: {errorMsg}
                </div>
            )}

            <div className="space-y-6">
                
                {/* Section: Trip Info */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold font-mono text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 mb-4">01 Trip Intent</h3>
                    <div className="grid grid-cols-1 gap-4">
                         <div className="col-span-1">
                            <label className="block text-xs font-serif text-stone-600 mb-1">目的地</label>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-3 top-3 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="城市/国家"
                                    className="w-full bg-stone-50 border-b border-stone-300 p-2 pl-9 text-sm focus:border-stone-900 focus:bg-white outline-none transition-colors placeholder:text-stone-300"
                                    value={state.inputs.targetCity}
                                    onChange={e => handleInputChange('targetCity', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-serif text-stone-600 mb-1">旅居核心目的</label>
                            <div className="relative">
                                <Target size={14} className="absolute left-3 top-3 text-stone-400" />
                                <select
                                    className="w-full bg-stone-50 border-b border-stone-300 p-2 pl-9 text-sm focus:border-stone-900 focus:bg-white outline-none transition-colors appearance-none"
                                    value={state.inputs.tripPurpose}
                                    onChange={e => handleInputChange('tripPurpose', e.target.value)}
                                >
                                    <option value="explore">🌏 探索新生活 / 流浪</option>
                                    <option value="healing">🧘‍♀️ 身心疗愈 / 躺平</option>
                                    <option value="career">💰 发展事业 / 搞钱</option>
                                    <option value="social">🥂 扩展社交 / 脱单</option>
                                    <option value="inspiration">💡 寻找创作灵感</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold font-mono text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 mb-4 mt-6">02 Personal Energy</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div className="col-span-1">
                            <label className="block text-xs font-serif text-stone-600 mb-1">出生日期</label>
                            <input
                                type="date"
                                className="w-full bg-stone-50 border-b border-stone-300 p-2 text-sm focus:border-stone-900 focus:bg-white outline-none transition-colors"
                                value={state.inputs.birthDate}
                                onChange={e => handleInputChange('birthDate', e.target.value)}
                            />
                        </div>
                         <div className="col-span-1">
                            <label className="block text-xs font-serif text-stone-600 mb-1">具体时间 <span className="text-stone-300">(选填)</span></label>
                            <input
                                type="time"
                                className="w-full bg-stone-50 border-b border-stone-300 p-2 text-sm focus:border-stone-900 focus:bg-white outline-none transition-colors"
                                value={state.inputs.birthTime}
                                onChange={e => handleInputChange('birthTime', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="col-span-1">
                            <label className="block text-xs font-serif text-stone-600 mb-1">出生地点</label>
                            <input
                                type="text"
                                placeholder="省份/城市"
                                className="w-full bg-stone-50 border-b border-stone-300 p-2 text-sm focus:border-stone-900 focus:bg-white outline-none transition-colors"
                                value={state.inputs.birthPlace}
                                onChange={e => handleInputChange('birthPlace', e.target.value)}
                            />
                        </div>
                         <div className="col-span-1">
                            <label className="block text-xs font-serif text-stone-600 mb-1">MBTI <span className="text-stone-300">(选填)</span></label>
                            <div className="relative">
                                <Brain size={14} className="absolute left-2 top-3 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="e.g. INFJ"
                                    className="w-full bg-stone-50 border-b border-stone-300 p-2 pl-8 text-sm focus:border-stone-900 focus:bg-white outline-none transition-colors uppercase"
                                    value={state.inputs.mbti}
                                    onChange={e => handleInputChange('mbti', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    disabled={isLoading}
                    className="w-full bg-stone-900 text-[#FDFBF7] p-4 rounded-sm font-bold font-serif hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2 mt-8 tracking-widest disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {isLoading ? 'CALCULATING...' : (
                        <>
                        开启城市能量测算 <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-1 text-stone-400">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-xs tracking-[0.2em] font-mono">
                JUYOU LAB © 2025
            </div>
            <div className="text-[10px] tracking-widest uppercase font-mono text-stone-400">
                 MAKE YOUR LIFE L!VE
            </div>
        </div>

        {/* 新增：免责声明 (使用极小字体 + 低透明度，降低视觉干扰) */}
        <div className="mt-4 max-w-[90%] text-center space-y-1 border-t border-stone-200 pt-3">
          <p className="text-[10px] text-stone-500/80 leading-relaxed font-sans">
             本工具基于环境心理学与地理数据算法，旨在帮助用户寻找身心舒适的旅居目的地。
          </p>
          <p className="text-[9px] text-stone-400/60 leading-relaxed transform scale-90">
            * 结果仅供生活娱乐与旅行决策参考，不构成绝对建议
          </p>
      </div>
    </div>
  );
}
