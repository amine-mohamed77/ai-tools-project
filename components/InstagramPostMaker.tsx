import React, { useState, useRef } from 'react';
import { Instagram, Loader2, Download, ImagePlus, Layout, Type, Palette, Terminal, ArrowRight, Megaphone, Tag, MousePointerClick } from 'lucide-react';
import { generateInstagramPost } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface InstagramPostMakerProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const InstagramPostMaker: React.FC<InstagramPostMakerProps> = ({ onImageGenerated }) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cta, setCta] = useState('SHOP NOW');
  const [style, setStyle] = useState('Minimalist & Clean');
  const [adType, setAdType] = useState('General Promotion');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = [
    "Minimalist & Clean",
    "Bold & Vibrant",
    "Luxury & Elegant",
    "Dark & Edgy",
    "Pastel & Cute",
    "Professional & Corporate",
    "Neon & Cyberpunk"
  ];

  const adTypes = [
    { id: 'promotion', label: 'General Promotion' },
    { id: 'sale', label: 'Flash Sale / Discount' },
    { id: 'new_arrival', label: 'New Arrival / Launch' },
    { id: 'event', label: 'Event / Webinar' },
    { id: 'quote', label: 'Quote / Inspiration' },
    { id: 'educational', label: 'Educational / Tips' }
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

    try {
      const result = await generateInstagramPost(
        productName, 
        description, 
        adType, 
        style, 
        price, 
        cta, 
        productImage || undefined
      );
      setResultImage(result);

      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `Insta Post: ${productName} [${adType}]`,
        aspectRatio: '1:1',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Insta)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء إنشاء البوست. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Block */}
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-black uppercase font-['Press_Start_2P'] flex items-center gap-2 leading-relaxed">
                INSTA <span className="bg-[#FF0000] text-white px-2">ADS</span>
              </h2>
              <p className="text-black font-bold font-['Space_Mono'] mt-2">> MARKETING_GENERATOR_V2.0</p>
            </div>
            <button 
               onClick={() => {
                 setProductName('');
                 setDescription('');
                 setPrice('');
                 setCta('SHOP NOW');
                 setProductImage(null);
                 setResultImage(null);
                 setAdType('General Promotion');
               }}
               className="text-sm font-bold text-red-600 hover:text-black uppercase border-b-2 border-transparent hover:border-black transition-colors"
             >
               [ RESET ]
             </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_#000] relative">
               
               {/* Label Tag */}
               <div className="absolute -top-3 -left-3 bg-black text-white text-xs font-bold px-3 py-1 uppercase">Campaign Data</div>

               <div className="space-y-6 mt-2">
                 {/* Product Name */}
                 <div>
                    <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                        <Type size={16} /> Brand/Product
                    </label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. NIKE AIR MAX"
                        className="w-full bg-gray-50 border-4 border-black p-3 text-black font-bold focus:shadow-[4px_4px_0px_0px_#FF0000] outline-none font-mono"
                    />
                 </div>
                 
                 {/* Ad Type Selector */}
                 <div>
                    <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                        <Megaphone size={16} /> Ad Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {adTypes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setAdType(t.label)}
                            className={`p-2 border-2 border-black text-xs font-bold uppercase transition-all text-left ${
                            adType === t.label
                                ? 'bg-black text-white'
                                : 'bg-white text-black hover:bg-gray-100'
                            }`}
                        >
                            {adType === t.label && <span className="mr-1">></span>} {t.label}
                        </button>
                        ))}
                    </div>
                 </div>

                 {/* Description */}
                 <div>
                    <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                        <Layout size={16} /> Headline / Hook
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. ULTIMATE COMFORT FOR RUNNERS..."
                        className="w-full h-20 bg-gray-50 border-4 border-black p-3 text-black font-bold focus:shadow-[4px_4px_0px_0px_#FF0000] outline-none resize-none font-mono"
                    />
                 </div>

                 {/* Price & CTA */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                            <Tag size={16} /> Price / Deal
                        </label>
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 50% OFF"
                            className="w-full bg-gray-50 border-4 border-black p-3 text-black font-bold focus:shadow-[4px_4px_0px_0px_#FF0000] outline-none font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                            <MousePointerClick size={16} /> Button CTA
                        </label>
                        <input
                            type="text"
                            value={cta}
                            onChange={(e) => setCta(e.target.value)}
                            placeholder="e.g. SHOP NOW"
                            className="w-full bg-gray-50 border-4 border-black p-3 text-black font-bold focus:shadow-[4px_4px_0px_0px_#FF0000] outline-none font-mono"
                        />
                    </div>
                 </div>

                 {/* Style Selector */}
                 <div>
                    <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                        <Palette size={16} /> Aesthetic
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {styles.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStyle(s)}
                            className={`p-2 border-2 border-black text-xs font-bold uppercase transition-all text-left ${
                            style === s
                                ? 'bg-black text-white'
                                : 'bg-white text-black hover:bg-gray-100'
                            }`}
                        >
                            {style === s && <span className="mr-1">></span>} {s}
                        </button>
                        ))}
                    </div>
                 </div>

                 {/* Image Upload */}
                 <div>
                    <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                        <ImagePlus size={16} /> Product Shot (Opt)
                    </label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-24 border-4 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                            productImage ? 'bg-gray-100 border-solid' : ''
                        }`}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                        {productImage ? (
                        <div className="flex items-center gap-2">
                            <img src={productImage} alt="Preview" className="h-16 w-16 object-cover border-2 border-black" />
                            <span className="font-bold text-xs uppercase">IMAGE_LOADED</span>
                        </div>
                        ) : (
                        <div className="text-center">
                            <span className="font-bold text-xs uppercase text-gray-500">CLICK TO UPLOAD</span>
                        </div>
                        )}
                    </div>
                 </div>

                 <button
                    onClick={handleGenerate}
                    disabled={isProcessing || !productName.trim() || !description.trim()}
                    className={`w-full py-5 border-4 border-black flex items-center justify-center gap-3 font-black text-lg uppercase transition-all ${
                        isProcessing || !productName.trim() || !description.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                        : 'bg-[#FF0000] text-white shadow-[8px_8px_0px_0px_#000] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] hover:bg-red-500'
                    }`}
                    >
                    {isProcessing ? (
                        <>
                        <Loader2 className="animate-spin" />
                        PROCESSING...
                        </>
                    ) : (
                        <>
                        <Instagram />
                        GENERATE AD
                        </>
                    )}
                 </button>
               </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
             <div className="bg-white border-4 border-black h-full min-h-[600px] flex flex-col shadow-[12px_12px_0px_0px_#000]">
                {/* Result Header */}
                <div className="flex justify-between items-center bg-black text-white p-3 border-b-4 border-black">
                  <span className="font-['Space_Mono'] font-bold text-sm">> OUTPUT_FEED (1:1)</span>
                  {resultImage && (
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = `insta-ad-${Date.now()}.png`;
                        link.click();
                      }}
                      className="text-white hover:text-[#FF0000] flex items-center gap-2 uppercase font-bold text-xs"
                    >
                      <Download size={14} /> DOWNLOAD
                    </button>
                  )}
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-gray-100 flex items-center justify-center relative p-8">
                   
                   {isProcessing ? (
                     <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_#000]">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#FF0000]" />
                        <p className="font-black uppercase font-mono">ASSEMBLING LAYOUT...</p>
                     </div>
                   ) : resultImage ? (
                     <div className="relative group w-full max-w-[500px] aspect-square bg-white border-4 border-black shadow-[16px_16px_0px_0px_#000]">
                        <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
                     </div>
                   ) : (
                     <div className="text-center opacity-40">
                        <Instagram size={64} className="mx-auto mb-4 text-black" strokeWidth={1.5} />
                        <h3 className="text-2xl font-black uppercase font-mono mb-2">NO SIGNAL</h3>
                        <p className="font-bold text-xs">ENTER DATA TO GENERATE VISUALS</p>
                     </div>
                   )}

                </div>
             </div>
          </div>

      </div>
    </div>
  );
};

export default InstagramPostMaker;