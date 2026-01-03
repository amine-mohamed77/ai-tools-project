import React, { useState, useRef, useEffect } from 'react';
import { 
  Megaphone, Loader2, Download, ImagePlus, Layout, Type, Palette, MonitorPlay, 
  Tag, MousePointerClick, Smartphone, Linkedin, Facebook, Instagram, Zap, 
  CheckCircle2, ArrowRight, ShoppingBag, Share2, BarChart, FlaskConical, Crown, 
  SplitSquareHorizontal, Layers, Wand2, Sun, Moon, Wind, Droplets
} from 'lucide-react';
import { generateAdPost } from '../services/geminiService';
import { GeneratedImage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AdsGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void;
  category?: 'product' | 'social' | 'smart' | 'opt' | 'ab' | 'premium';
}

interface ToolDef {
    id: string;
    label: string;
    desc: string;
    icon: React.ReactNode;
    defaultRatio?: string;
}

const AdsGenerator: React.FC<AdsGeneratorProps> = ({ onImageGenerated, category = 'social' }) => {
  const { t, dir } = useLanguage();
  
  // State for Navigation (Selection vs Workspace)
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  // Form State
  const [platform, setPlatform] = useState('Instagram Feed (1:1)');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cta, setCta] = useState('SHOP NOW');
  const [style, setStyle] = useState('Modern & Clean');
  const [atmosphere, setAtmosphere] = useState('Studio Minimal'); // New unique input
  const [adType, setAdType] = useState('Product Launch');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration for tools per category
  // Added "themeColor" and "accent" to make each category look unique
  // Updated descriptions to use t() for translation
  const toolConfig: Record<string, { title: string, themeColor: string, accent: string, tools: ToolDef[] }> = {
    'product': {
      title: t('ads_product'),
      themeColor: 'border-blue-900',
      accent: 'bg-blue-600',
      tools: [
        { id: 'prod_gen', label: 'Classic Product Ad', desc: t('ads_tool_product_gen'), icon: <ShoppingBag size={24} /> },
        { id: 'lifestyle', label: 'Lifestyle Context', desc: t('ads_tool_lifestyle'), icon: <ImagePlus size={24} /> },
        { id: 'before_after', label: 'Before / After', desc: t('ads_tool_compare'), icon: <SplitSquareHorizontal size={24} /> },
        { id: 'minimal', label: 'Studio Minimal', desc: t('ads_tool_minimal'), icon: <Layout size={24} /> }
      ]
    },
    'social': {
      title: t('ads_social'),
      themeColor: 'border-pink-600',
      accent: 'bg-pink-600',
      tools: [
        { id: 'insta_ad', label: 'Instagram Feed', desc: t('ads_tool_insta'), icon: <Instagram size={24} /> },
        { id: 'story_ad', label: 'Story / Reel', desc: t('ads_tool_story'), icon: <Smartphone size={24} />, defaultRatio: 'Stories (9:16)' },
        { id: 'fb_ad', label: 'Facebook Post', desc: t('ads_tool_facebook'), icon: <Facebook size={24} /> },
        { id: 'thumb_ad', label: 'Video Thumbnail', desc: t('ads_tool_thumb'), icon: <MonitorPlay size={24} />, defaultRatio: 'LinkedIn/Twitter (16:9)' }
      ]
    },
    'smart': {
      title: t('ads_smart'),
      themeColor: 'border-purple-600',
      accent: 'bg-purple-600',
      tools: [
        { id: 'bg_gen', label: 'Smart Background', desc: t('ads_tool_bg'), icon: <Wand2 size={24} /> },
        { id: 'cta_overlay', label: 'CTA Focus', desc: t('ads_tool_cta'), icon: <MousePointerClick size={24} /> },
        { id: 'text_img', label: 'Typography Ad', desc: t('ads_tool_text'), icon: <Type size={24} /> },
        { id: 'brand_style', label: 'Brand Kit', desc: t('ads_tool_brand'), icon: <Palette size={24} /> }
      ]
    },
    'opt': {
      title: t('ads_opt'),
      themeColor: 'border-green-600',
      accent: 'bg-green-600',
      tools: [
        { id: 'optimize', label: 'Ad Optimizer', desc: t('ads_tool_opt'), icon: <Zap size={24} /> },
        { id: 'eye_catch', label: 'Attention Grabber', desc: t('ads_tool_attention'), icon: <CheckCircle2 size={24} /> }
      ]
    },
    'ab': {
      title: t('ads_ab'),
      themeColor: 'border-orange-600',
      accent: 'bg-orange-600',
      tools: [
        { id: 'var_gen', label: 'A/B Variations', desc: t('ads_tool_ab'), icon: <Layers size={24} /> },
        { id: 'bg_test', label: 'Background Test', desc: t('ads_tool_bgtest'), icon: <FlaskConical size={24} /> }
      ]
    },
    'premium': {
      title: t('ads_premium'),
      themeColor: 'border-yellow-600',
      accent: 'bg-yellow-600',
      tools: [
        { id: 'competitor', label: 'Competitor Analysis', desc: t('ads_tool_competitor'), icon: <BarChart size={24} /> },
        { id: 'trend', label: 'Trend Jacking', desc: t('ads_tool_trend'), icon: <Crown size={24} /> }
      ]
    }
  };

  const currentCategoryConfig = toolConfig[category] || toolConfig['social'];
  const activeToolDef = currentCategoryConfig.tools.find(t => t.id === selectedToolId);

  // Reset Selection when category changes
  useEffect(() => {
    setSelectedToolId(null);
    setResultImage(null);
    setProductName('');
    setDescription('');
  }, [category]);

  // Apply tool defaults when selected
  useEffect(() => {
    if (activeToolDef?.defaultRatio) {
        setPlatform(activeToolDef.defaultRatio);
    }
  }, [activeToolDef]);

  const platforms = [
    { id: 'Instagram Feed (1:1)', icon: <Instagram size={14} />, label: 'Instagram (Square)' },
    { id: 'Stories (9:16)', icon: <Smartphone size={14} />, label: 'Stories / TikTok' },
    { id: 'Facebook Feed (1:1)', icon: <Facebook size={14} />, label: 'Facebook Feed' },
    { id: 'LinkedIn/Twitter (16:9)', icon: <Linkedin size={14} />, label: 'LinkedIn / X (Wide)' },
  ];

  const styles = [
    "Modern & Clean",
    "Bold & Energetic",
    "Luxury & Minimal",
    "Corporate & Trust",
    "Playful & Pop",
    "Cyberpunk / Neon"
  ];

  const atmosphereOptions = [
    { id: 'Studio Minimal', label: t('ads_input_mood_minimal'), icon: <Layout size={14}/> },
    { id: 'Luxury Gold', label: t('ads_input_mood_luxury'), icon: <Crown size={14}/> },
    { id: 'Nature Organic', label: t('ads_input_mood_nature'), icon: <Wind size={14}/> },
    { id: 'Urban Street', label: t('ads_input_mood_urban'), icon: <Zap size={14}/> },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!productName.trim() || !description.trim()) return;

    setIsProcessing(true);
    setResultImage(null);

    // Modify prompt based on selected tool
    let finalAdType = adType;
    let finalDescription = description;

    // Enhanced Prompt Logic per Tool
    if (selectedToolId === 'lifestyle') {
      finalDescription = `${description}. Show this product in a ${atmosphere} setting to show scale and usage. Realistic photography.`;
    } else if (selectedToolId === 'before_after') {
        finalDescription = `${description}. Create a Split-Screen composition. Left side 'Before' (Problem), Right side 'After' (Solution). Style: ${atmosphere}`;
        finalAdType = 'Comparison Ad';
    } else if (selectedToolId === 'minimal') {
        finalDescription = `${description}. Use a very clean, ${atmosphere} solid color background with professional soft lighting. Minimalist aesthetic, lots of negative space.`;
    } else if (selectedToolId === 'cta_overlay') {
        finalDescription = `${description}. Make the Call to Action button '${cta}' extremely prominent, glowing, and central.`;
    } else if (selectedToolId === 'eye_catch') {
        finalDescription = `${description}. High contrast, saturated colors, focus on the most important feature to grab attention immediately.`;
    } else if (selectedToolId === 'var_gen') {
        finalDescription = `${description}. Create a unique layout variation distinct from standard ads.`;
    } else if (selectedToolId === 'story_ad') {
        finalDescription = `${description}. Design specifically for Vertical 9:16 Full Screen. Leave space at top and bottom for UI elements.`;
    } else if (selectedToolId === 'text_img') {
        finalDescription = `${description}. Focus on TYPOGRAPHY. The text should be the main visual element. Artistic font layout.`;
    }

    try {
      const result = await generateAdPost(
        platform,
        productName, 
        finalDescription, 
        finalAdType, 
        style, 
        price, 
        cta, 
        productImage || undefined
      );
      setResultImage(result);

      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `Ad [${selectedToolId}]: ${productName}`,
        aspectRatio: platform.includes('9:16') ? '9:16' : (platform.includes('16:9') ? '16:9' : '1:1'),
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Ad)'
      });

    } catch (error) {
      alert("Error generating ad. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDER: SELECTION GRID (HUB) ---
  if (!selectedToolId) {
    return (
        <div className="max-w-6xl mx-auto">
            <div className={`bg-white border-4 ${currentCategoryConfig.themeColor} p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] mb-8 text-center rounded-xl`}>
                <h2 className="text-3xl font-black text-black uppercase font-['Press_Start_2P'] mb-4">
                    {currentCategoryConfig.title}
                </h2>
                <p className="text-gray-600 font-bold font-['Space_Mono'] uppercase">
                    {t('ads_select_tool_desc')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentCategoryConfig.tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedToolId(tool.id)}
                        className={`bg-white p-6 border-2 border-gray-200 hover:${currentCategoryConfig.themeColor} hover:border-4 rounded-xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center group h-64 justify-center relative overflow-hidden`}
                    >
                        <div className={`w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:${currentCategoryConfig.accent} group-hover:text-white transition-colors`}>
                            {tool.icon}
                        </div>
                        <h3 className="text-lg font-black uppercase font-['Space_Mono'] mb-2">{tool.label}</h3>
                        <p className="text-xs text-gray-500 font-bold px-2">{tool.desc}</p>
                        
                        {/* Hover Effect Background */}
                        <div className={`absolute bottom-0 left-0 w-full h-1 ${currentCategoryConfig.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform`}></div>
                    </button>
                ))}
            </div>
        </div>
    );
  }

  // --- RENDER: WORKSPACE (GENERATOR) ---
  return (
    <div className="max-w-6xl mx-auto">
      {/* Workspace Header */}
      <div className={`bg-white border-4 ${currentCategoryConfig.themeColor} p-4 shadow-md rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4`}>
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setSelectedToolId(null)}
                className={`w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-black hover:text-white border border-gray-300 rounded-full transition-colors ${dir === 'rtl' ? 'rotate-180' : ''}`}
                title={t('ads_back_btn')}
            >
                <ArrowRight size={20} className="transform rotate-180" />
            </button>
            <div className={`pl-4 ${dir === 'rtl' ? 'border-r-2 pr-4' : 'border-l-2'}`}>
                <h2 className="text-xl font-black text-black uppercase font-['Press_Start_2P'] flex items-center gap-2">
                    {activeToolDef?.label}
                </h2>
                <div className="flex gap-2 mt-1">
                   <span className={`text-[10px] px-2 py-0.5 rounded text-white font-bold uppercase ${currentCategoryConfig.accent}`}>
                      {category.toUpperCase()} TOOL
                   </span>
                </div>
            </div>
          </div>
          
          <button 
               onClick={() => {
                 setProductName('');
                 setDescription('');
                 setPrice('');
                 setCta('SHOP NOW');
                 setProductImage(null);
                 setResultImage(null);
               }}
               className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase flex items-center gap-1"
             >
               <Layers size={12} /> RESET_FORM
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`bg-white p-6 border-2 ${currentCategoryConfig.themeColor} rounded-xl shadow-lg relative overflow-hidden`}>
               
               {/* Accent Header Line */}
               <div className={`absolute top-0 left-0 w-full h-2 ${currentCategoryConfig.accent}`}></div>

               <div className="space-y-5 mt-4">
                 
                 {/* 1. Platform & Ratio (Hidden for Story/Reel tools which are fixed) */}
                 {selectedToolId !== 'story_ad' && (
                     <div>
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                            <MonitorPlay size={14} /> {t('ads_lbl_platform')}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {platforms.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPlatform(p.id)}
                                className={`p-2 border rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                                platform === p.id
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {p.icon} <span className="truncate">{p.label}</span>
                            </button>
                            ))}
                        </div>
                     </div>
                 )}

                 {/* 2. Product Identity */}
                 <div className="grid grid-cols-1 gap-4">
                     <div>
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                            <Type size={14} /> {t('ads_lbl_product')}
                        </label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g. LUMIX X5"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-black outline-none font-mono text-sm"
                        />
                     </div>
                     {/* Unique Input: Atmosphere (Only for Product/Lifestyle) */}
                     {(category === 'product' || selectedToolId === 'bg_gen') && (
                        <div>
                             <label className="block text-xs font-black text-gray-500 mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                                <Sun size={14} /> {t('ads_input_atmosphere')}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {atmosphereOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setAtmosphere(opt.id)}
                                        className={`p-2 text-[10px] border rounded-lg font-bold flex items-center gap-2 transition-all ${
                                            atmosphere === opt.id 
                                            ? `bg-gray-100 border-${currentCategoryConfig.themeColor.replace('border-', '')} text-black ring-1 ring-black` 
                                            : 'bg-white text-gray-400 border-gray-200'
                                        }`}
                                    >
                                        {opt.icon} {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                     )}
                 </div>

                 {/* 3. Creative Details */}
                 <div>
                    <label className="block text-xs font-black text-gray-500 mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                        <Layout size={14} /> {t('ads_lbl_desc')}
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Key benefit: 'Capture the night with AI low-light mode...'"
                        className="w-full h-24 bg-gray-50 border border-gray-300 rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-black outline-none resize-none font-mono text-sm"
                    />
                 </div>

                 {/* 4. Visual Style (Aesthetic) */}
                 <div>
                    <label className="block text-xs font-black text-gray-500 mb-2 uppercase font-['Space_Mono']">
                        {t('ads_lbl_style')}
                    </label>
                    <div className="relative">
                        <select 
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-bold uppercase cursor-pointer appearance-none"
                        >
                            {styles.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
                            <Palette size={14} />
                        </div>
                    </div>
                 </div>

                 {/* 5. Commerce Data (Price/CTA) - Hidden for pure Art/Bg tools */}
                 {selectedToolId !== 'bg_gen' && selectedToolId !== 'text_img' && (
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-500 mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                                <Tag size={14} /> {t('ads_lbl_price')}
                            </label>
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="$299"
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-black outline-none font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                                <MousePointerClick size={14} /> {t('ads_lbl_cta')}
                            </label>
                            <input
                                type="text"
                                value={cta}
                                onChange={(e) => setCta(e.target.value)}
                                placeholder="BUY NOW"
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-black outline-none font-mono text-sm"
                            />
                        </div>
                     </div>
                 )}

                 {/* 6. Image Upload */}
                 <div>
                    <label className="block text-xs font-black text-gray-500 mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                        <ImagePlus size={14} /> {t('ads_lbl_image')}
                    </label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                            productImage ? 'bg-green-50 border-green-500 border-solid' : ''
                        }`}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                        {productImage ? (
                        <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 size={16} />
                            <span className="font-bold text-[10px] uppercase">IMAGE ATTACHED</span>
                        </div>
                        ) : (
                        <div className="text-center flex items-center gap-2 text-gray-400">
                            <ShoppingBag size={14} />
                            <span className="font-bold text-[10px] uppercase">UPLOAD PRODUCT</span>
                        </div>
                        )}
                    </div>
                 </div>

                 {/* GENERATE BUTTON */}
                 <button
                    onClick={handleGenerate}
                    disabled={isProcessing || !productName.trim() || !description.trim()}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-black text-lg uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                        isProcessing || !productName.trim() || !description.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : `${currentCategoryConfig.accent} text-white`
                    }`}
                    >
                    {isProcessing ? (
                        <>
                        <Loader2 className="animate-spin" />
                        GENERATING...
                        </>
                    ) : (
                        <>
                        <Megaphone />
                        {t('ads_generate_btn')}
                        </>
                    )}
                 </button>
               </div>
            </div>
          </div>

          {/* Result Section (Preview) */}
          <div className="lg:col-span-7">
             <div className={`bg-white border-2 ${currentCategoryConfig.themeColor} h-full min-h-[600px] flex flex-col shadow-lg rounded-xl overflow-hidden`}>
                {/* Result Header */}
                <div className={`flex justify-between items-center ${currentCategoryConfig.accent} text-white p-3`}>
                  <span className="font-['Space_Mono'] font-bold text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      PREVIEW MODE
                  </span>
                  {resultImage && (
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = `ad-creative-${Date.now()}.png`;
                        link.click();
                      }}
                      className="bg-white/20 hover:bg-white/40 px-3 py-1 rounded-full flex items-center gap-2 uppercase font-bold text-xs transition-colors"
                    >
                      <Download size={14} /> SAVE
                    </button>
                  )}
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-gray-50 flex items-center justify-center relative p-8">
                    {/* Background Pattern */}
                   <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                   
                   {isProcessing ? (
                     <div className="bg-white p-8 rounded-2xl shadow-xl text-center z-10">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full border-4 border-t-${currentCategoryConfig.themeColor.replace('border-', '')} border-r-transparent border-b-transparent border-l-transparent animate-spin`}></div>
                        <p className="font-black uppercase text-gray-800 text-sm">RENDERING PIXELS...</p>
                        <p className="text-xs font-mono mt-2 text-gray-500">Applying {style} filters</p>
                     </div>
                   ) : resultImage ? (
                     // Phone Frame for Story/Social, Plain for others
                     <div className={`relative z-10 transition-all duration-500 animate-in zoom-in-95 ${
                         platform.includes('9:16') ? 'w-[320px] rounded-[30px] border-8 border-gray-900 shadow-2xl overflow-hidden bg-black' : 'max-w-full shadow-2xl rounded-lg'
                     }`}>
                        <img src={resultImage} alt="Result" className="w-full h-auto object-contain" />
                        
                        {/* Fake UI Overlay for Stories */}
                        {platform.includes('9:16') && (
                            <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-center text-white/80 pointer-events-none">
                                <div className="w-8 h-1 bg-white/50 rounded"></div>
                                <div className="w-8 h-1 bg-white/50 rounded"></div>
                                <div className="w-8 h-1 bg-white/50 rounded"></div>
                            </div>
                        )}
                     </div>
                   ) : (
                     <div className="text-center opacity-40 z-10">
                        <div className={`w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center`}>
                           {activeToolDef?.icon}
                        </div>
                        <h3 className="text-2xl font-black uppercase text-gray-400 mb-2">CANVAS READY</h3>
                        <p className="font-bold text-xs text-gray-400">Fill in the parameters to generate</p>
                     </div>
                   )}

                </div>
             </div>
          </div>

      </div>
    </div>
  );
};

export default AdsGenerator;