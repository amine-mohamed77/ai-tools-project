import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Loader2, Download, ArrowRightLeft, ImagePlus } from 'lucide-react';
import { editImage } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface ImageEnhancerProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({ onImageGenerated }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    
    // Specific prompt for enhancement
    const prompt = "Enhance the quality of this image drastically. Make it 4k resolution, sharpen details, improve lighting and color balance, remove noise, and make it look professional and photorealistic. Keep the content exactly the same, just improve quality.";

    try {
      const result = await editImage(originalImage, prompt);
      setEditedImage(result);
      
      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: 'تحسين جودة الصورة',
        aspectRatio: '1:1',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Enhance)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-purple-400" />
              محسن الصور الذكي
            </h2>
            <p className="text-slate-400 text-sm mt-1">رفع الدقة وتحسين التفاصيل والإضاءة</p>
          </div>
          {originalImage && (
             <button 
               onClick={() => {
                 setOriginalImage(null);
                 setEditedImage(null);
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
              <h3 className="text-lg font-bold text-white mb-2">اضغط لرفع صورة للتحسين</h3>
              <p className="text-slate-500">أو اسحب الصورة هنا</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Original */}
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>الأصل</span>
                </div>
                <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative">
                  <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                </div>
                
                <button
                    onClick={handleEnhance}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg bg-purple-600 hover:bg-purple-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin" />
                        جاري التحسين...
                      </>
                    ) : (
                      <>
                        <Sparkles />
                        تحسين الجودة الآن
                      </>
                    )}
                  </button>
              </div>

              {/* Result */}
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>بعد التحسين</span>
                  {editedImage && (
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = editedImage;
                        link.download = `enhanced-${Date.now()}.png`;
                        link.click();
                      }}
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Download size={14} /> تحميل
                    </button>
                  )}
                </div>
                <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative">
                  {isProcessing ? (
                    <div className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                         <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping"></div>
                         <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-slate-400">جاري معالجة البيكسلات...</p>
                    </div>
                  ) : editedImage ? (
                    <img src={editedImage} alt="Enhanced" className="w-full h-full object-contain animate-in fade-in duration-700" />
                  ) : (
                    <div className="text-center text-slate-600">
                      <ArrowRightLeft className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>النتيجة ستظهر هنا</p>
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

export default ImageEnhancer;