import React, { useState, useRef } from 'react';
import { Upload, Paintbrush, Loader2, Download, ImagePlus, ArrowRightLeft } from 'lucide-react';
import { applyStyle } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface ArtisticEffectsProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const ArtisticEffects: React.FC<ArtisticEffectsProps> = ({ onImageGenerated }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = [
    { id: 'brush_strokes', label: 'ضربات فرشاة', desc: 'تأثير زيتي بارز وقوي (Impasto)', prompt: 'Heavy Impasto Oil Painting with visible thick brush strokes, artistic texture' },
    { id: 'watercolor', label: 'ألوان مائية', desc: 'ناعم، انسيابي، وشفاف', prompt: 'Soft abstract Watercolor painting, wet-on-wet technique, artistic splashes' },
    { id: 'pencil', label: 'رسم رصاص', desc: 'تخطيط يدوي كلاسيكي', prompt: 'Charcoal and Graphite Pencil Sketch, high detail, shading' },
    { id: 'cyberpunk', label: 'سايبر بانك', desc: 'ألوان نيون مستقبلية', prompt: 'Cyberpunk style, neon lights, futuristic aesthetic, high contrast' },
    { id: 'pop_art', label: 'بوب آرت', desc: 'ألوان فاقعة ونمط كوميكس', prompt: 'Pop Art style, Andy Warhol inspired, bold colors, halftone patterns' },
    { id: 'mosaic', label: 'فسيفساء', desc: 'قطع صغيرة متراصة', prompt: 'Ancient Roman Mosaic art style, tiles texture' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setResultImage(null);
        setSelectedStyle(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyEffect = async (styleId: string, prompt: string) => {
    if (!originalImage) return;

    setSelectedStyle(styleId);
    setIsProcessing(true);
    
    try {
      const result = await applyStyle(originalImage, prompt);
      setResultImage(result);
      
      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `تأثير فني: ${styleId}`,
        aspectRatio: '1:1',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Style)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء تطبيق التأثير. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-pink-900/20 to-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Paintbrush className="text-pink-400" />
              تأثيرات فنية
            </h2>
            <p className="text-slate-400 text-sm mt-1">حول صورك إلى لوحات فنية بلمسة واحدة</p>
          </div>
          {originalImage && (
             <button 
               onClick={() => {
                 setOriginalImage(null);
                 setResultImage(null);
                 setSelectedStyle(null);
               }}
               className="text-sm text-red-400 hover:text-red-300"
             >
               بدء جديد
             </button>
          )}
        </div>

        <div className="p-6">
          {!originalImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ImagePlus className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">اضغط لرفع صورة</h3>
              <p className="text-slate-500">لإضافة تأثيرات الفرشاة والألوان الفنية</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Styles & Original */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Preview Original */}
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-600 mx-auto lg:mx-0">
                   <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-3">اختر التأثير الفني</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => handleApplyEffect(style.id, style.prompt)}
                          disabled={isProcessing}
                          className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                            selectedStyle === style.id
                              ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-900/20'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                          } disabled:opacity-50`}
                        >
                          <span className="font-bold text-sm">{style.label}</span>
                          <span className={`text-xs ${selectedStyle === style.id ? 'text-pink-200' : 'text-slate-500'}`}>{style.desc}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              {/* Right Side: Result */}
              <div className="lg:col-span-7">
                <div className="flex justify-between text-slate-400 text-sm font-medium mb-2">
                  <span>اللوحة الفنية</span>
                  {resultImage && (
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = `art-effect-${Date.now()}.png`;
                        link.click();
                      }}
                      className="text-pink-400 hover:text-pink-300 flex items-center gap-1"
                    >
                      <Download size={14} /> تحميل
                    </button>
                  )}
                </div>
                <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative">
                  {isProcessing ? (
                    <div className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                         <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full animate-ping"></div>
                         <div className="absolute inset-0 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-slate-400">جاري الرسم...</p>
                    </div>
                  ) : resultImage ? (
                    <img src={resultImage} alt="Artistic Result" className="w-full h-full object-contain animate-in fade-in duration-700" />
                  ) : (
                    <div className="text-center text-slate-600">
                      <ArrowRightLeft className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>اختر تأثيراً لرؤية النتيجة</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisticEffects;