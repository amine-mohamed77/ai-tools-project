import React from 'react';
import { Menu, User, Grid, Search, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  toggleSidebar: () => void;
  goHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, goHome }) => {
  const { t } = useLanguage();

  return (
    <div className="px-4 pt-4 sticky top-0 z-30 pointer-events-none">
      <header className="h-16 mx-auto max-w-7xl bg-[#F1F1F1] rounded-full shadow-lg border border-white/50 flex items-center justify-between px-2 pr-2 md:pr-6 pointer-events-auto">
        
        {/* Left: Brand / Menu */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSidebar}
            className="md:hidden w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:bg-[#333]"
          >
            <Menu size={20} />
          </button>
          
          <button 
            onClick={goHome}
            className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:bg-[#333] transition-colors group"
          >
            <span className="font-['JetBrains_Mono'] font-bold text-lg group-hover:scale-110 transition-transform">AI</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center bg-[#E5E5E5] rounded-full h-12 px-1">
             <button onClick={goHome} className="px-6 h-10 rounded-full text-xs hover:bg-white text-gray-500 font-bold">{t('header_info')}</button>
             <button className="px-6 h-10 rounded-full text-xs bg-white shadow-sm text-black font-bold">{t('header_news')}</button>
             <button className="px-6 h-10 rounded-full text-xs bg-[#FF5500] text-white font-bold hover:bg-[#FF7700]">{t('header_features')}</button>
             <button className="px-6 h-10 rounded-full text-xs hover:bg-white text-gray-500 font-bold">{t('header_buy')}</button>
          </div>
        </div>

        {/* Center: Search/Product Bar (Dotted border style) */}
        <div className="hidden lg:flex flex-1 mx-4 h-12 border-2 border-dotted border-gray-300 rounded-full items-center justify-center px-6">
           <span className="font-['JetBrains_Mono'] text-xs text-gray-500 uppercase tracking-widest">{t('header_discover')}</span>
        </div>

        {/* Right: Subscribe/Profile */}
        <div className="flex items-center gap-2">
          
          <button className="hidden sm:flex h-12 px-8 bg-black text-white rounded-full items-center justify-center hover:bg-[#222] transition-colors">
             <span className="text-xs font-bold tracking-widest">{t('header_sub')}</span>
          </button>

          <button className="w-12 h-12 bg-[#E5E5E5] flex items-center justify-center rounded-full hover:bg-white transition-colors text-black font-bold text-lg">
             #
          </button>

        </div>
      </header>
    </div>
  );
};

export default Header;