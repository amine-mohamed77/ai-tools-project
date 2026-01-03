import React, { useState } from 'react';
import { PenTool, Briefcase, Type, Palette, Loader2, Download, Hexagon } from 'lucide-react';
import { generateLogo } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface LogoMakerProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const LogoMaker: React.FC<LogoMakerProps> = ({ onImageGenerated }) => {
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('minimalist');
  const [colors, setColors] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const styles = [
    { id: 'minimalist', label: 'تبسيطي (Minimalist)', desc: 'أنيق، بسيط، عصري' },
    { id: 'abstract', label: 'تجريدي (Abstract)', desc: 'أشكال هندسية فنية' },
    { id: 'mascot', label: 'شخصية (Mascot)', desc: 'كاريكاتير أو شخصية ودودة' },
    { id: 'vintage', label: 'كلاسيكي (Vintage)', desc: 'نمط قديم وتراثي' },
    { id: '3d_glossy', label: 'ثلاثي الأبعاد (3D)', desc: 'واقعي مع ظلال وإضاءة' },
    { id: 'lettermark', label: 'حروفي (Lettermark)', desc: 'التركيز على الأحرف الأولى' },
  ];

  const handleGenerate = async () => {
    if (!brandName.trim() || !industry.trim()) return;

    setIsProcessing(true);
    setResultImage(null);

    try {
      const result = await generateLogo(brandName, industry, selectedStyle, colors || 'Any suitable colors');
      setResultImage(result);

      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `Logo: ${brandName}, Style: ${selectedStyle}`,
        aspectRatio: '1:1',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Logo)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء تصميم الشعار. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-orange-900/20 to-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PenTool className="text-orange-400" />
              صانع الشعارات (Logo Maker)
            </h2>
            <p className="text-slate-400 text-sm mt-1">صمم هوية بصرية كاملة لعلامتك التجارية</p>
          </div>
          <button 
             onClick={() => {
               setBrandName('');
               setIndustry('');
               setColors('');
               setResultImage(null);
             }}
             className="text-sm text-red-400 hover:text-red-300"
           >
             بدء جديد
           </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Brand Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
                <Type size={16} /> اسم العلامة التجارية
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="مثال: TechWave, Coffee House..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
                <Briefcase size={16} /> المجال / النشاط
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="مثال: تقنية، مطعم، أزياء، عقارات..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Colors */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
                <Palette size={16} /> الألوان المفضلة (اختياري)
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="مثال: أزرق وذهبي، أسود وأبيض..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Styles Grid */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">نمط الشعار</label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-lg border text-right transition-all text-xs flex flex-col gap-1 ${
                      selectedStyle === style.id
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !brandName.trim() || !industry.trim()}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all ${
                isProcessing || !brandName.trim() || !industry.trim()
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-500 text-white hover:shadow-orange-500/25'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" />
                  جاري التصميم...
                </>
              ) : (
                <>
                  <PenTool />
                  تصميم الشعار
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            <div className="flex justify-between text-slate-400 text-sm font-medium mb-2">
               <span>النتيجة</span>
               {resultImage && (
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = `logo-${brandName}.png`;
                        link.click();
                      }}
                      className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    >
                      <Download size={14} /> تحميل
                    </button>
                  )}
            </div>
            <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative group">
              {isProcessing ? (
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                     <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full animate-ping"></div>
                     <div className="absolute inset-0 border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-slate-400 animate-pulse">يتم رسم الهوية البصرية...</p>
                </div>
              ) : resultImage ? (
                <div className="relative w-full h-full p-8 bg-white/5 flex items-center justify-center">
                   {/* We add a subtle pattern background to show transparency if generated, though gemini usually generates solid bg */}
                   <img src={resultImage} alt="Logo Result" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
                </div>
              ) : (
                <div className="text-center text-slate-600 px-8">
                  <Hexagon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-slate-500 mb-2">مساحة العرض</h3>
                  <p className="text-sm">أدخل بيانات علامتك التجارية واضغط على "تصميم الشعار" لترى النتيجة هنا.</p>
                </div>
              )}
            </div>
            
             {/* Tips */}
             <div className="mt-4 bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-orange-400 text-sm font-bold mb-2">نصيحة احترافية:</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  الشعارات التي يتم توليدها تكون بخلفية بسيطة غالباً. استخدم أداة "عزل الخلفية" من القائمة الجانبية لإزالة الخلفية والحصول على شعار شفاف (PNG) جاهز للاستخدام.
                </p>
           </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LogoMaker;