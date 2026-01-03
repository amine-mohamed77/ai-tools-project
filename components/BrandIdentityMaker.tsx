import React, { useState } from 'react';
import { Briefcase, LayoutTemplate, Loader2, Download, Palette, Layers, Type, Terminal } from 'lucide-react';
import { generateBrandIdentity } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface BrandIdentityMakerProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const BrandIdentityMaker: React.FC<BrandIdentityMakerProps> = ({ onImageGenerated }) => {
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('modern_corporate');
  const [colors, setColors] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const themes = [
    { id: 'modern_corporate', label: 'CORPORATE', desc: 'Professional, Clean' },
    { id: 'creative_playful', label: 'CREATIVE', desc: 'Bold, Playful' },
    { id: 'luxury_elegant', label: 'LUXURY', desc: 'Minimal, Elegant' },
    { id: 'tech_futuristic', label: 'TECH/CYBER', desc: 'Neon, Dark' },
    { id: 'eco_organic', label: 'ORGANIC', desc: 'Earth tones, Calm' },
    { id: 'minimalist', label: 'MINIMAL', desc: 'B&W, Spacious' },
  ];

  const handleGenerate = async () => {
    if (!brandName.trim() || !description.trim()) return;

    setIsProcessing(true);
    setResultImage(null);

    try {
      const selectedThemeLabel = themes.find(t => t.id === theme)?.label || theme;
      const result = await generateBrandIdentity(brandName, description, selectedThemeLabel, colors || 'Harmonious palette');
      setResultImage(result);

      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `Brand Identity: ${brandName}`,
        aspectRatio: '16:9',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Brand)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء تصميم الهوية. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-black uppercase font-['Press_Start_2P'] flex items-center gap-2 leading-relaxed">
                BRAND <span className="bg-[#FF0000] text-white px-2">IDENTITY</span>
              </h2>
              <p className="text-black font-bold font-['Space_Mono'] mt-2">> GENERATE_FULL_KIT.EXE</p>
            </div>
            <button 
               onClick={() => {
                 setBrandName('');
                 setDescription('');
                 setColors('');
                 setResultImage(null);
               }}
               className="text-sm font-bold text-red-600 hover:text-black uppercase border-b-2 border-transparent hover:border-black"
             >
               [ RESET SYSTEM ]
             </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
                {/* Brand Name */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-black text-black mb-2 uppercase font-['Space_Mono']">
                    <Type size={16} /> Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="NAME..."
                    className="w-full bg-white border-4 border-black p-3 text-black font-bold focus:shadow-[4px_4px_0px_0px_#FF0000] outline-none"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-black text-black mb-2 uppercase font-['Space_Mono']">
                    <LayoutTemplate size={16} /> Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the business..."
                    className="w-full h-24 bg-white border-4 border-black p-3 text-black font-bold focus:shadow-[4px_4px_0px_0px_#FF0000] outline-none resize-none"
                  />
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-black text-black mb-2 uppercase font-['Space_Mono']">
                    <Palette size={16} /> Color Palette
                  </label>
                  <input
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    placeholder="Blue & Gold..."
                    className="w-full bg-white border-4 border-black p-3 text-black font-bold focus:shadow-[4px_4px_0px_0px_#FF0000] outline-none"
                  />
                </div>

                {/* Theme Grid */}
                <div className="mb-6">
                  <label className="block text-sm font-black text-black mb-3 uppercase font-['Space_Mono']">Visual Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-2 border-2 border-black text-left flex flex-col ${
                          theme === t.id
                            ? 'bg-black text-white shadow-[4px_4px_0px_0px_#FF0000]'
                            : 'bg-white text-black hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_#000]'
                        }`}
                      >
                        <span className="font-bold text-xs uppercase">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isProcessing || !brandName.trim() || !description.trim()}
                  className={`w-full py-4 border-4 border-black flex items-center justify-center gap-2 font-black text-lg uppercase transition-all ${
                    isProcessing || !brandName.trim() || !description.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                      : 'bg-[#FF0000] text-white shadow-[6px_6px_0px_0px_#000] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_#000]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Briefcase />
                      GENERATE KIT
                    </>
                  )}
                </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-8">
            <div className="bg-white border-4 border-black h-full min-h-[500px] flex flex-col shadow-[12px_12px_0px_0px_#000]">
                <div className="flex justify-between items-center bg-black text-white p-3 border-b-4 border-black">
                  <span className="font-['Space_Mono'] font-bold">> PREVIEW_OUTPUT</span>
                  {resultImage && (
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = resultImage;
                            link.download = `brand-identity-${brandName}.png`;
                            link.click();
                          }}
                          className="text-white hover:text-[#FF0000] flex items-center gap-1 uppercase font-bold text-xs"
                        >
                          <Download size={14} /> DOWNLOAD_ASSET
                        </button>
                      )}
                </div>
                
                <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-gray-50 flex items-center justify-center relative p-4">
                  {isProcessing ? (
                    <div className="text-center p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000]">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <Loader2 className="w-16 h-16 animate-spin text-black" />
                      </div>
                      <p className="text-black font-bold animate-pulse font-['Space_Mono']">DESIGNING ASSETS...</p>
                    </div>
                  ) : resultImage ? (
                    <img src={resultImage} alt="Brand Identity Result" className="w-full h-auto object-contain border-4 border-black shadow-[8px_8px_0px_0px_#000]" />
                  ) : (
                    <div className="text-center text-gray-400 px-8">
                      <Layers className="w-24 h-24 mx-auto mb-4 text-black opacity-20" />
                      <h3 className="text-xl font-black text-black mb-2 uppercase">NO DATA</h3>
                      <p className="text-sm font-bold font-['Space_Mono']">Waiting for input parameters...</p>
                    </div>
                  )}
                </div>
            </div>
            
             {/* Info Cards */}
             <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <h5 className="text-[#FF0000] font-black text-xs mb-2 uppercase">01. LOGO DESIGN</h5>
                    <p className="text-black text-xs font-bold">Primary & Secondary marks</p>
                </div>
                <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <h5 className="text-[#FF0000] font-black text-xs mb-2 uppercase">02. STATIONERY</h5>
                    <p className="text-black text-xs font-bold">Business cards & Letterhead</p>
                </div>
                <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <h5 className="text-[#FF0000] font-black text-xs mb-2 uppercase">03. MOCKUPS</h5>
                    <p className="text-black text-xs font-bold">Real-world application</p>
                </div>
             </div>
          </div>

        </div>
    </div>
  );
};

export default BrandIdentityMaker;