import React, { useState, useRef } from 'react';
import { Upload, Wand2, Loader2, Download, ImagePlus, ArrowRight } from 'lucide-react';
import { editImage } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface ImageMontageProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const ImageMontage: React.FC<ImageMontageProps> = ({ onImageGenerated }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage || !prompt.trim()) return;

    setIsProcessing(true);
    
    try {
      // Use the generic editImage service which is perfect for "Add X to image"
      const result = await editImage(sourceImage, prompt);
      setResultImage(result);
      
      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `Magic Edit: ${prompt}`,
        aspectRatio: '1:1',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Edit)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء تعديل الصورة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-teal-900/20 to-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wand2 className="text-teal-400" />
              المعدل السحري (Magic Edit)
            </h2>
            <p className="text-slate-400 text-sm mt-1">أضف عناصر للصورة أو غير محتواها بالكتابة فقط</p>
          </div>
          {sourceImage && (
             <button 
               onClick={() => {
                 setSourceImage(null);
                 setResultImage(null);
                 setPrompt('');
               }}
               className="text-sm text-red-400 hover:text-red-300"
             >
               بدء جديد
             </button>
          )}
        </div>

        <div className="p-6 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Input */}
            <div className="space-y-6">
              
              {/* Image Uploader */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">الصورة الأصلية</label>
                <div 
                  onClick={() => !sourceImage && fileInputRef.current?.click()}
                  className={`aspect-square w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                    sourceImage ? 'border-teal-500 bg-slate-900' : 'border-slate-600 hover:bg-slate-800 cursor-pointer'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                    disabled={!!sourceImage}
                  />
                  {sourceImage ? (
                    <img src={sourceImage} alt="Source" className="w-full h-full object-contain" />
                  ) : (
                    <>
                       <ImagePlus className="text-slate-500 mb-4 w-12 h-12" />
                       <span className="text-slate-400 font-medium">اضغط لرفع صورة</span>
                       <span className="text-slate-500 text-xs mt-1">JPG, PNG</span>
                    </>
                  )}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">ماذا تريد أن تفعل؟</label>
                <div className="relative">
                    <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="مثال: أضف قبعة حمراء، اجعل السماء تمطر، ضع ديناصور في الخلفية..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 pr-4 pl-12 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none shadow-inner"
                    />
                    <Wand2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isProcessing || !sourceImage || !prompt.trim()}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all ${
                  isProcessing || !sourceImage || !prompt.trim()
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-500 text-white hover:shadow-teal-500/25'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" />
                    جاري التنفيذ...
                  </>
                ) : (
                  <>
                    <Wand2 />
                    تطبيق التعديل
                  </>
                )}
              </button>

            </div>

            {/* Right Column: Result */}
            <div className="space-y-6">
               <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-slate-400">النتيجة</label>
                    {resultImage && (
                        <button 
                            onClick={() => {
                            const link = document.createElement('a');
                            link.href = resultImage;
                            link.download = `magic-edit-${Date.now()}.png`;
                            link.click();
                            }}
                            className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
                        >
                            <Download size={16} /> تحميل
                        </button>
                    )}
               </div>
               
               <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative group">
                  {isProcessing ? (
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                         <div className="absolute inset-0 border-4 border-teal-500/30 rounded-full animate-ping"></div>
                         <div className="absolute inset-0 border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-slate-400 animate-pulse">الذكاء الاصطناعي يعدل الصورة...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                        <img src={resultImage} alt="Magic Edit Result" className="w-full h-full object-contain animate-in fade-in duration-700" />
                    </div>
                  ) : (
                    <div className="text-center text-slate-600 px-6">
                      <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>ارفع الصورة واكتب طلبك لرؤية السحر هنا</p>
                    </div>
                  )}
               </div>
               
               {/* Tips */}
               <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <h4 className="text-teal-400 text-sm font-bold mb-2">نصائح للحصول على أفضل النتائج:</h4>
                    <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
                        <li>كن محدداً في وصف الشيء الذي تريد إضافته.</li>
                        <li>حدد المكان (مثلاً: "على الطاولة"، "في السماء").</li>
                        <li>يمكنك طلب تغيير الألوان أو الأجواء (مثلاً: "اجعل الجو ليلاً").</li>
                    </ul>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMontage;