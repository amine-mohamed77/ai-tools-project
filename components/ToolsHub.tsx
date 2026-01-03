import React from 'react';
import { 
  Image as ImageIcon, Youtube, Wand2, Paintbrush, ScanFace, PenTool, UserCheck, 
  Mountain, Briefcase, RefreshCcw, Sparkles, Eraser, Layers, ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ToolsHubProps {
  onSelectTool: (toolId: string) => void;
}

const ToolsHub: React.FC<ToolsHubProps> = ({ onSelectTool }) => {
  const { t, dir } = useLanguage();

  const tools = [
    { id: 'generate', label: t('tool_generate'), icon: <ImageIcon size={24} />, desc: t('hub_desc_gen'), color: 'text-blue-500', border: 'hover:border-blue-500' },
    { id: 'face-swap', label: t('tool_faceswap'), icon: <RefreshCcw size={24} />, desc: t('hub_desc_faceswap'), color: 'text-green-500', border: 'hover:border-green-500' },
    { id: 'consistent-char', label: t('tool_character'), icon: <UserCheck size={24} />, desc: t('hub_desc_char'), color: 'text-emerald-500', border: 'hover:border-emerald-500' },
    { id: 'brand-identity', label: t('tool_branding'), icon: <Briefcase size={24} />, desc: t('hub_desc_brand'), color: 'text-purple-500', border: 'hover:border-purple-500' },
    { id: 'logo', label: t('tool_logo'), icon: <PenTool size={24} />, desc: t('hub_desc_logo'), color: 'text-orange-500', border: 'hover:border-orange-500' },
    { id: 'change-bg', label: t('tool_bgchange'), icon: <Mountain size={24} />, desc: t('hub_desc_bg'), color: 'text-lime-500', border: 'hover:border-lime-500' },
    { id: 'montage', label: t('tool_montage'), icon: <Wand2 size={24} />, desc: t('hub_desc_magic'), color: 'text-teal-500', border: 'hover:border-teal-500' },
    { id: 'effects', label: t('tool_effects'), icon: <Paintbrush size={24} />, desc: t('hub_desc_art'), color: 'text-pink-500', border: 'hover:border-pink-500' },
    { id: 'blur-face', label: t('tool_privacy'), icon: <ScanFace size={24} />, desc: t('hub_desc_blur'), color: 'text-cyan-500', border: 'hover:border-cyan-500' },
    { id: 'thumbnail', label: t('tool_thumbnail'), icon: <Youtube size={24} />, desc: t('hub_desc_thumb'), color: 'text-red-500', border: 'hover:border-red-500' },
    { id: 'enhance', label: t('tool_enhance'), icon: <Sparkles size={24} />, desc: t('hub_desc_enhance'), color: 'text-yellow-500', border: 'hover:border-yellow-500' },
    { id: 'remove-bg', label: t('tool_isolate'), icon: <Eraser size={24} />, desc: t('hub_desc_remove'), color: 'text-indigo-500', border: 'hover:border-indigo-500' },
    { id: 'merge', label: t('tool_merge'), icon: <Layers size={24} />, desc: t('hub_desc_merge'), color: 'text-slate-500', border: 'hover:border-slate-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] mb-8">
        <h2 className="text-3xl font-black text-black uppercase font-['Press_Start_2P'] leading-relaxed">
          AI <span className="bg-black text-white px-2">{t('hub_title')}</span>
        </h2>
        <p className="text-black font-bold font-['Space_Mono'] mt-2">> {t('hub_subtitle')}</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className={`group bg-white p-6 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all text-left flex flex-col justify-between h-48 ${tool.border}`}
          >
            <div>
              <div className={`mb-4 ${tool.color} group-hover:scale-110 transition-transform origin-left`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-black uppercase font-['Space_Mono'] mb-1">{tool.label}</h3>
              <p className="text-xs font-bold text-gray-500">{tool.desc}</p>
            </div>
            <div className={`flex justify-end opacity-0 group-hover:opacity-100 transition-opacity ${dir === 'rtl' ? 'rotate-180' : ''}`}>
               <ArrowRight size={20} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolsHub;