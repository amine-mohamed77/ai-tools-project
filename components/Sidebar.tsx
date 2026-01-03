import React, { useState } from 'react';
import { 
  LayoutDashboard, MessageSquare, Megaphone, Grid, Home, X, ChevronDown, ChevronRight,
  Image as ImageIcon, Youtube, Wand2, Paintbrush, ScanFace, PenTool, UserCheck, 
  Mountain, Briefcase, RefreshCcw, Sparkles, Eraser, Layers, ShoppingBag, Share2, Zap, BarChart, FlaskConical, Crown, Settings
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, closeSidebar }) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isAdsOpen, setIsAdsOpen] = useState(true);
  const { t, dir } = useLanguage();
  
  // Define which IDs belong to the "Tools" group
  const toolsIds = [
    'generate', 'face-swap', 'consistent-char', 'brand-identity', 
    'logo', 'change-bg', 'montage', 'effects', 'blur-face', 
    'thumbnail', 'enhance', 'remove-bg', 'merge'
  ];

  // Define which IDs belong to the "Ads" group
  const adsIds = [
    'ads-product', 'ads-social', 'ads-smart', 'ads-opt', 'ads-ab', 'ads-premium'
  ];

  // Main Navigation Items
  const mainItems = [
    { id: 'home', label: t('nav_home'), icon: <Home size={18} /> },
    { id: 'chat', label: t('nav_chat'), icon: <MessageSquare size={18} /> },
  ];

  // Ads Sub-menu Items
  const adsItems = [
    { id: 'ads-product', label: t('ads_product'), icon: <ShoppingBag size={16} /> },
    { id: 'ads-social', label: t('ads_social'), icon: <Share2 size={16} /> },
    { id: 'ads-smart', label: t('ads_smart'), icon: <Zap size={16} /> },
    { id: 'ads-opt', label: t('ads_opt'), icon: <BarChart size={16} /> },
    { id: 'ads-ab', label: t('ads_ab'), icon: <FlaskConical size={16} /> },
    { id: 'ads-premium', label: t('ads_premium'), icon: <Crown size={16} /> },
  ];

  // Tools Sub-menu Items
  const toolItems = [
    { id: 'generate', label: t('tool_generate'), icon: <ImageIcon size={16} /> },
    { id: 'face-swap', label: t('tool_faceswap'), icon: <RefreshCcw size={16} /> },
    { id: 'consistent-char', label: t('tool_character'), icon: <UserCheck size={16} /> },
    { id: 'brand-identity', label: t('tool_branding'), icon: <Briefcase size={16} /> },
    { id: 'logo', label: t('tool_logo'), icon: <PenTool size={16} /> },
    { id: 'change-bg', label: t('tool_bgchange'), icon: <Mountain size={16} /> },
    { id: 'montage', label: t('tool_montage'), icon: <Wand2 size={16} /> },
    { id: 'effects', label: t('tool_effects'), icon: <Paintbrush size={16} /> },
    { id: 'blur-face', label: t('tool_privacy'), icon: <ScanFace size={16} /> },
    { id: 'thumbnail', label: t('tool_thumbnail'), icon: <Youtube size={16} /> },
    { id: 'enhance', label: t('tool_enhance'), icon: <Sparkles size={16} /> },
    { id: 'remove-bg', label: t('tool_isolate'), icon: <Eraser size={16} /> },
    { id: 'merge', label: t('tool_merge'), icon: <Layers size={16} /> },
  ];

  const archiveItem = { id: 'gallery', label: t('nav_archive'), icon: <LayoutDashboard size={18} /> };
  const settingsItem = { id: 'settings', label: t('nav_settings'), icon: <Settings size={18} /> };

  const isToolActive = toolsIds.includes(activeTab) || activeTab === 'tools-hub';
  const isAdActive = adsIds.includes(activeTab) || activeTab === 'ads-creator';

  const ChevronIcon = dir === 'rtl' ? (isToolsOpen ? ChevronDown : ChevronRight) : (isToolsOpen ? ChevronDown : ChevronRight); // Same icon for both usually, but logic kept clean

  return (
    <aside className="w-64 bg-[#F1F1F1] flex flex-col h-screen border-r border-white/50 z-50 font-['JetBrains_Mono']">
      
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-end p-4">
         <button 
          onClick={closeSidebar}
          className="p-2 bg-white rounded-full text-black hover:bg-gray-200"
        >
          <X size={20} />
        </button>
      </div>

      {/* Header */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 bg-[#FF5500] rounded-full animate-pulse"></div>
            <h1 className="text-sm font-bold tracking-widest">SYSTEM_OS</h1>
        </div>
        <p className="text-[10px] text-gray-400 uppercase">v3.1.0 Multi-Lang</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto custom-scrollbar">
        
        {/* Main Items */}
        {mainItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              closeSidebar();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-xs font-bold tracking-wide uppercase group ${
              activeTab === item.id
                ? 'bg-white text-black shadow-[4px_4px_0px_0px_#000] translate-x-1'
                : 'text-gray-500 hover:text-black hover:bg-white/50'
            }`}
          >
            <span className={`${activeTab === item.id ? 'text-[#FF5500]' : 'text-gray-400 group-hover:text-black'}`}>
                {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}

        {/* ADS MARKET Dropdown */}
        <div className="space-y-1">
            <button
                onClick={() => setIsAdsOpen(!isAdsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-xs font-bold tracking-wide uppercase group ${
                isAdActive
                    ? 'bg-black text-white shadow-[4px_4px_0px_0px_#FF5500] translate-x-1'
                    : 'text-gray-500 hover:text-black hover:bg-white/50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <span className={`${isAdActive ? 'text-[#FF5500]' : 'text-gray-400 group-hover:text-black'}`}>
                        <Megaphone size={18} />
                    </span>
                    <span>{t('nav_ads')}</span>
                </div>
                {isAdsOpen ? <ChevronDown size={14} /> : (dir === 'rtl' ? <ChevronRight size={14} className="rotate-180" /> : <ChevronRight size={14} />)}
            </button>

            {/* Dropdown Content */}
            {isAdsOpen && (
                <div className={`space-y-1 mt-1 ${dir === 'rtl' ? 'border-r-2 mr-4 pr-4' : 'border-l-2 ml-4 pl-4'} border-gray-200`}>
                    {adsItems.map((tool) => (
                         <button
                            key={tool.id}
                            onClick={() => {
                                setActiveTab(tool.id);
                                closeSidebar();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-[10px] font-bold tracking-wide uppercase group ${
                                activeTab === tool.id
                                ? 'bg-[#FF5500] text-white shadow-sm'
                                : 'text-gray-400 hover:text-black hover:bg-white/50'
                            }`}
                         >
                            <span className={`${activeTab === tool.id ? 'text-white' : 'text-gray-400 group-hover:text-black'}`}>
                                {tool.icon}
                            </span>
                            <span>{tool.label}</span>
                         </button>
                    ))}
                </div>
            )}
        </div>

        {/* AI STUDIO Dropdown */}
        <div className="space-y-1">
            <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-xs font-bold tracking-wide uppercase group ${
                isToolActive
                    ? 'bg-black text-white shadow-[4px_4px_0px_0px_#FF5500] translate-x-1'
                    : 'text-gray-500 hover:text-black hover:bg-white/50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <span className={`${isToolActive ? 'text-[#FF5500]' : 'text-gray-400 group-hover:text-black'}`}>
                        <Grid size={18} />
                    </span>
                    <span>{t('nav_tools')}</span>
                </div>
                {isToolsOpen ? <ChevronDown size={14} /> : (dir === 'rtl' ? <ChevronRight size={14} className="rotate-180" /> : <ChevronRight size={14} />)}
            </button>

            {/* Dropdown Content */}
            {isToolsOpen && (
                <div className={`space-y-1 mt-1 ${dir === 'rtl' ? 'border-r-2 mr-4 pr-4' : 'border-l-2 ml-4 pl-4'} border-gray-200`}>
                    {toolItems.map((tool) => (
                         <button
                            key={tool.id}
                            onClick={() => {
                                setActiveTab(tool.id);
                                closeSidebar();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-[10px] font-bold tracking-wide uppercase group ${
                                activeTab === tool.id
                                ? 'bg-[#FF5500] text-white shadow-sm'
                                : 'text-gray-400 hover:text-black hover:bg-white/50'
                            }`}
                         >
                            <span className={`${activeTab === tool.id ? 'text-white' : 'text-gray-400 group-hover:text-black'}`}>
                                {tool.icon}
                            </span>
                            <span>{tool.label}</span>
                         </button>
                    ))}
                </div>
            )}
        </div>

        {/* Archive */}
        <button
            onClick={() => {
              setActiveTab(archiveItem.id);
              closeSidebar();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-xs font-bold tracking-wide uppercase group ${
              activeTab === archiveItem.id
                ? 'bg-white text-black shadow-[4px_4px_0px_0px_#000] translate-x-1'
                : 'text-gray-500 hover:text-black hover:bg-white/50'
            }`}
          >
            <span className={`${activeTab === archiveItem.id ? 'text-[#FF5500]' : 'text-gray-400 group-hover:text-black'}`}>
                {archiveItem.icon}
            </span>
            <span>{archiveItem.label}</span>
        </button>

        {/* Settings */}
        <button
            onClick={() => {
              setActiveTab(settingsItem.id);
              closeSidebar();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-xs font-bold tracking-wide uppercase group ${
              activeTab === settingsItem.id
                ? 'bg-white text-black shadow-[4px_4px_0px_0px_#000] translate-x-1'
                : 'text-gray-500 hover:text-black hover:bg-white/50'
            }`}
          >
            <span className={`${activeTab === settingsItem.id ? 'text-[#FF5500]' : 'text-gray-400 group-hover:text-black'}`}>
                {settingsItem.icon}
            </span>
            <span>{settingsItem.label}</span>
        </button>

      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
         <div className="bg-[#E5E5E5] rounded-xl p-4 flex items-center gap-3">
             <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">U</div>
             <div className="flex-1">
                 <div className="text-[10px] font-bold uppercase">Pro User</div>
                 <div className="text-[10px] text-gray-500">ID: 8842-X</div>
             </div>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;