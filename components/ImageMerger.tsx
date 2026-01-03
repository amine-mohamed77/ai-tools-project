import React, { useState, useRef } from 'react';
import { Upload, Layers, Loader2, Download, Plus, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { mergeImages } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface ImageMergerProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const ImageMerger: React.FC<ImageMergerProps> = ({ onImageGenerated }) => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setImage: (s: string | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMergedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMerge = async () => {
    if (!image1 || !image2) return;

    setIsProcessing(true);
    
    // Default prompt if empty
    const finalPrompt = prompt.trim() || "Combine these two images into a single cohesive artistic composition. seamless blend.";

    try {
      const result = await mergeImages(image1, image2, finalPrompt);
      setMergedImage(result);
      
      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `دمج صور: ${finalPrompt}`,
        aspectRatio: '1:1',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Merge)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء دمج الصور. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="text-blue-400" />
              دمج الصور
            </h2>
            <p className="text-slate-400 text-sm mt-1">اجمع بين صورتين لإنشاء تصميم جديد فريد</p>
          </div>
          {(image1 || image2) && (
             <button 
               onClick={() => {
                 setImage1(null);
                 setImage2(null);
                 setMergedImage(null);
                 setPrompt('');
               }}
               className="text-sm text-red-400 hover:text-red-300"
             >
               بدء جديد
             </button>
          )}
        </div>

        <div className="p-6 space-y-8">
          
          {/* Inputs Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            
            {/* Image 1 */}
            <div 
              onClick={() => fileInput1Ref.current?.click()}
              className={`w-full md:w-1/3 aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                image1 ? 'border-blue-500 bg-slate-900' : 'border-slate-600 hover:bg-slate-800'
              }`}
            >
              <input type="file" ref={fileInput1Ref} onChange={(e) => handleFileUpload(e, setImage1)} accept="image/*" className="hidden" />
              {image1 ? (
                <img src={image1} alt="Source 1" className="w-full h-full object-contain" />
              ) : (
                <>
                   <Upload className="text-slate-500 mb-2" />
                   <span className="text-slate-400 text-sm">الصورة الأولى</span>
                </>
              )}
            </div>

            {/* Plus Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              <Plus size={24} />
            </div>

            {/* Image 2 */}
             <div 
              onClick={() => fileInput2Ref.current?.click()}
              className={`w-full md:w-1/3 aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                image2 ? 'border-blue-500 bg-slate-900' : 'border-slate-600 hover:bg-slate-800'
              }`}
            >
              <input type="file" ref={fileInput2Ref} onChange={(e) => handleFileUpload(e, setImage2)} accept="image/*" className="hidden" />
              {image2 ? (
                <img src={image2} alt="Source 2" className="w-full h-full object-contain" />
              ) : (
                <>
                   <Upload className="text-slate-500 mb-2" />
                   <span className="text-slate-400 text-sm">الصورة الثانية</span>
                </>
              )}
            </div>
          </div>

          {/* Prompt Section */}
          <div className="max-w-2xl mx-auto">
             <label className="block text-sm font-medium text-slate-400 mb-2">تعليمات الدمج (اختياري)</label>
             <input
               type="text"
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="مثال: ادمج العنصر من الصورة الأولى مع خلفية الصورة الثانية..."
               className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
             />
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
                onClick={handleMerge}
                disabled={isProcessing || !image1 || !image2}
                className={`px-8 py-3 rounded-xl flex items-center gap-2 font-bold text-lg shadow-lg transition-all ${
                  isProcessing || !image1 || !image2
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/25'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" />
                    جاري الدمج...
                  </>
                ) : (
                  <>
                    <Layers />
                    دمج الصورتين
                  </>
                )}
            </button>
          </div>

          {/* Result Section */}
          {mergedImage && (
            <div className="border-t border-slate-700 pt-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <h3 className="text-center text-xl font-bold text-white mb-4">النتيجة النهائية</h3>
               <div className="max-w-md mx-auto aspect-square bg-slate-900 rounded-xl overflow-hidden border-2 border-blue-500/50 shadow-2xl shadow-blue-900/20 relative group">
                  <img src={mergedImage} alt="Merged Result" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = mergedImage;
                          link.download = `merged-${Date.now()}.png`;
                          link.click();
                        }}
                        className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                      >
                        <Download size={18} /> تحميل الصورة
                      </button>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ImageMerger;