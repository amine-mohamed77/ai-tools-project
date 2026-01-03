import React, { useState, useRef } from 'react';
import { Mountain, ImagePlus, Loader2, Download, Send } from 'lucide-react';
import { replaceBackground } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface BackgroundChangerProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const BackgroundChanger: React.FC<BackgroundChangerProps> = ({ onImageGenerated }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!originalImage || !prompt.trim()) return;

    setIsProcessing(true);
    
    try {
      const result = await replaceBackground(originalImage, prompt);
      setResultImage(result);
      
      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `New Background: ${prompt}`,
        aspectRatio: '1:1',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Bg-Swap)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء تغيير الخلفية. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-lime-900/20 to-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mountain className="text-lime-400" />
              تغيير الخلفية (Background Changer)
            </h2>
            <p className="text-slate-400 text-sm mt-1">احتفظ بالشخصية أو المنتج، وغير المكان بالكامل</p>
          </div>
          {originalImage && (
             <button 
               onClick={() => {
                 setOriginalImage(null);
                 setResultImage(null);
                 setPrompt('');
               }}
               className="text-sm text-red-400 hover:text-red-300"
             >
               بدء جديد
             </button>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="space-y-6">
            
            {/* Original Image */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">1. الصورة الأصلية</label>
              <div 
                onClick={() => !originalImage && fileInputRef.current?.click()}
                className={`aspect-square w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                  originalImage ? 'border-lime-500 bg-slate-900' : 'border-slate-600 hover:bg-slate-800 cursor-pointer'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                  disabled={!!originalImage}
                />
                {originalImage ? (
                  <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                ) : (
                  <>
                     <ImagePlus className="text-slate-500 mb-4 w-12 h-12" />
                     <span className="text-slate-400 font-medium">رفع صورة المنتج أو الشخص</span>
                  </>
                )}
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">2. وصف الخلفية الجديدة</label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="مثال: شاطئ استوائي وقت الغروب، مكتب فخم، فضاء خارجي..."
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !originalImage || !prompt.trim()}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all ${
                isProcessing || !originalImage || !prompt.trim()
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-lime-600 hover:bg-lime-500 text-white hover:shadow-lime-500/25'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Mountain />
                  تغيير الخلفية
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-slate-400">النتيجة</label>
                {resultImage && (
                    <button 
                        onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = `new-background-${Date.now()}.png`;
                        link.click();
                        }}
                        className="text-lime-400 hover:text-lime-300 text-sm flex items-center gap-1"
                    >
                        <Download size={16} /> تحميل
                    </button>
                )}
            </div>
            
            <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative group">
              {isProcessing ? (
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-lime-500/30 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 border-4 border-t-lime-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-slate-400 animate-pulse">يتم دمج الخلفية الجديدة...</p>
                </div>
              ) : resultImage ? (
                <div className="relative w-full h-full">
                    <img src={resultImage} alt="New Background" className="w-full h-full object-contain animate-in fade-in duration-700" />
                </div>
              ) : (
                <div className="text-center text-slate-600 px-6">
                  <Mountain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>سيتم استبدال خلفية الصورة الأصلية بالوصف الذي كتبته</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BackgroundChanger;