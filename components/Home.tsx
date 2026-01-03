import React from 'react';
import { ArrowRight, Play, Cpu, Zap, Radio, Grip } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const { t, dir } = useLanguage();

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-center px-4 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambience (Orange Blur) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF5500] opacity-10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Main Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Typography */}
            <div className="lg:col-span-5 relative z-20">
                <h1 className="text-[180px] leading-[0.8] font-black tracking-tighter text-black select-none mix-blend-overlay opacity-80 hidden lg:block">
                    AI
                </h1>
                <h1 className="text-8xl leading-none font-black tracking-tighter text-black lg:hidden mb-8">
                    AI
                </h1>

                <div className="mt-8 space-y-6">
                    <div className="flex justify-between items-end border-b border-gray-300 pb-2">
                        <span className="font-mono text-xs font-bold text-gray-500">{t('home_badge_free')}</span>
                        <span className="font-mono text-xs font-bold text-gray-500 uppercase">{t('home_badge_avail')}</span>
                    </div>

                    <p className="font-mono text-sm leading-relaxed text-gray-700 max-w-sm uppercase">
                        {t('home_hero_desc')}
                    </p>

                    <button 
                        onClick={onStart}
                        className="group flex items-center gap-4 text-black hover:text-[#FF5500] transition-colors pl-0"
                    >
                        <span className="w-12 h-12 rounded-full border border-black group-hover:border-[#FF5500] flex items-center justify-center">
                            <Play size={16} fill="currentColor" className={dir === 'rtl' ? 'rotate-180' : ''} />
                        </span>
                        <span className="font-mono font-bold text-sm tracking-widest">{t('home_start_btn')}</span>
                    </button>
                </div>
            </div>

            {/* Center Visual (Product Mockup Style) */}
            <div className="lg:col-span-4 relative flex justify-center lg:justify-start h-[400px] lg:h-[600px] items-center">
                {/* 3D-like Device Representation */}
                <div 
                    onClick={onStart}
                    className="relative w-64 h-80 bg-[#F1F1F1] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 flex flex-col items-center p-6 cursor-pointer hover:scale-105 transition-transform duration-500 group"
                >
                    {/* Screen */}
                    <div className="w-full h-32 bg-[#222] rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#333] to-[#111]"></div>
                        <Zap className="text-[#FF5500] w-12 h-12 animate-pulse" />
                        <span className="absolute top-2 right-2 text-[8px] text-white font-mono">REC</span>
                    </div>

                    {/* Controls */}
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-[#E5E5E5] rounded-full shadow-inner flex items-center justify-center">
                            <div className="w-8 h-8 bg-[#D1D1D1] rounded-full"></div>
                        </div>
                        <div className="grid grid-rows-2 gap-2">
                            <div className="bg-[#E5E5E5] rounded-lg shadow-sm"></div>
                            <div className="bg-[#FF5500] rounded-lg shadow-sm"></div>
                        </div>
                    </div>

                    {/* Decorative Hand (Abstracted circle/shadow) */}
                    <div className="absolute -z-10 bottom-[-40px] w-40 h-40 bg-black/5 rounded-full blur-xl transform scale-x-150"></div>
                </div>

                {/* Floating "7" or Graphic Element behind */}
                <div className={`absolute top-10 ${dir === 'rtl' ? 'left-0 lg:-left-20' : 'right-0 lg:-right-20'} text-[200px] font-black text-[#FF5500] opacity-20 -z-10 font-mono leading-none pointer-events-none`}>
                    7
                </div>
            </div>

            {/* Right Specs List */}
            <div className="lg:col-span-3 flex flex-col justify-end h-full pb-12">
                <div className="text-right space-y-12">
                     <div className="space-y-2">
                        <h3 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest">{t('home_specs_conn')}</h3>
                        <p className="font-mono text-xs text-gray-600 max-w-[200px] ml-auto">
                            {t('home_specs_conn_desc')}
                        </p>
                     </div>

                     <div className="flex justify-end gap-12">
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto border border-gray-300 rounded-full flex items-center justify-center mb-2 text-gray-400">
                                <Radio size={20} />
                            </div>
                            <span className="font-mono text-[10px] uppercase font-bold text-gray-500">{t('home_specs_audio')}</span>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto border border-gray-300 rounded-full flex items-center justify-center mb-2 text-gray-400">
                                <Cpu size={20} />
                            </div>
                            <span className="font-mono text-[10px] uppercase font-bold text-gray-500">{t('home_specs_device')}</span>
                        </div>
                     </div>

                     <ul className="font-mono text-[10px] leading-relaxed text-gray-500 uppercase list-none space-y-1 border-t border-gray-300 pt-4">
                        <li>• 3 TRRS Stereo Input/Output</li>
                        <li>• 1 Main/Headphones Output</li>
                        <li>• 24-Bit/96 kHz Generation</li>
                        <li>• Internal Neural Engine</li>
                        <li>• 7 HR Rechargeable Battery</li>
                        <li>• 128 GB of Cloud Storage</li>
                     </ul>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Home;