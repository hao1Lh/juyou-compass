import React, { useState } from 'react';
import { Lock, CreditCard, ArrowRight, ShieldCheck, Star, Key } from 'lucide-react';

interface Props {
  onUnlock: () => void;
}

// 简单的本地校验逻辑
const verifyCode = (input: string): boolean => {
  const cleanInput = input.trim().toUpperCase();
  // 1. 固定口令 (用于内部测试或活动)
  const validCodes = ["JUYOU2025", "VIP888", "OPENLAB"];
  
  // 2. 前缀校验规则 (用于自动发卡)
  // 你可以在发卡平台设置生成的卡密都以 "JUYOU-" 开头，例如 "JUYOU-A7B2"
  if (cleanInput.startsWith("JUYOU-")) return true;
  
  return validCodes.includes(cleanInput);
};

const Paywall: React.FC<Props> = ({ onUnlock }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleUnlock = () => {
    if (!code) return;
    setIsVerifying(true);
    setError(false);

    // 模拟网络请求的延迟感
    setTimeout(() => {
      if (verifyCode(code)) {
        onUnlock();
      } else {
        setError(true);
        setIsVerifying(false);
      }
    }, 600);
  };

  const handlePurchaseClick = () => {
    // -----------------------------------------------------------------------
    // [重要配置] 请将下方链接替换为你自己的商品链接
    // 推荐平台：面包多 (mianbaoduo.com) 或 数码荔枝
    // -----------------------------------------------------------------------
    const PURCHASE_URL = "https://mianbaoduo.com/o/your-product-link"; 
    
    window.open(PURCHASE_URL, "_blank");
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
      {/* 磨砂背景 */}
      <div className="absolute inset-0 bg-[#FDFBF7]/90 backdrop-blur-md"></div>

      <div className="relative w-full max-w-sm bg-white shadow-xl border border-stone-200 p-8 text-center rounded-sm">
        
        {/* 顶部图标 */}
        <div className="w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
          <Lock size={20} />
        </div>

        <h3 className="text-xl font-bold text-stone-900 mb-2 font-serif">
          解锁完整天机档案
        </h3>
        <p className="text-stone-500 text-xs mb-8 leading-relaxed px-2">
          您正在访问深度定制的策略内容。<br/>
          支付 ¥9.9 即可获取针对您命盘的专属避坑指南与行动蓝图。
        </p>

        {/* 价值点展示 */}
        <div className="text-left space-y-4 mb-8 px-4 py-4 bg-stone-50 rounded-sm border border-stone-100">
          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-stone-600 leading-tight">
              <span className="font-bold text-stone-900 block mb-0.5">深度分析</span>
              基于命理的城市陷阱预警
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Star size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-stone-600 leading-tight">
              <span className="font-bold text-stone-900 block mb-0.5">行动蓝图</span>
              旅居前/中/后三阶段规划
            </span>
          </div>
          <div className="flex items-start gap-3">
             <Key size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-stone-600 leading-tight">
              <span className="font-bold text-stone-900 block mb-0.5">旅居思维</span>
              本地人都不一定知道的生活捷径
            </span>
          </div>
        </div>

        {/* 按钮区 */}
        <div className="space-y-4">
          <button
            onClick={handlePurchaseClick}
            className="w-full bg-stone-900 hover:bg-orange-600 text-white py-3.5 rounded-sm font-bold text-sm tracking-widest transition-all flex items-center justify-center gap-2 group shadow-md"
          >
            <CreditCard size={16} />
            获取访问密钥 (¥9.9)
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink-0 mx-3 text-stone-300 text-[10px] uppercase tracking-widest">Input Key</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="在此输入密钥..."
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              className={`w-full bg-white border ${error ? 'border-red-500 bg-red-50 text-red-900 placeholder:text-red-300' : 'border-stone-300 focus:border-stone-900'} rounded-sm px-4 py-3 text-center text-sm outline-none transition-all placeholder:text-stone-300 font-mono uppercase tracking-widest`}
            />
          </div>
          
          <button
             onClick={handleUnlock}
             disabled={!code || isVerifying}
             className="w-full text-stone-400 hover:text-stone-900 text-xs font-bold py-2 transition-colors disabled:opacity-50"
          >
            {isVerifying ? '验证中...' : '确认解锁 / VERIFY'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
