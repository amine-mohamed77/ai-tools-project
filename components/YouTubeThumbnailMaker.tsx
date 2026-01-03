import React, { useState, useRef } from 'react';
import { Upload, Youtube, Loader2, Download, User, Image as ImageIcon } from 'lucide-react';
import { generateYouTubeThumbnail } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface YouTubeThumbnailMakerProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const YouTubeThumbnailMaker: React.FC<YouTubeThumbnailMakerProps> = ({ onImageGenerated }) => {
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setImage: (s: string | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!title.trim()) return;

    setIsProcessing(true);
    
    try {
      const result = await generateYouTubeThumbnail(title, subjectImage, bgImage);
      setResultImage(result);
      
      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `YouTube Thumbnail: ${title}`,
        aspectRatio: '16:9',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Thumbnail)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء إنشاء الصورة المصغرة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-red-900/20 to-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Youtube className="text-red-500" />
              صانع المصغرات (Thumbnails)
            </h2>
            <p className="text-slate-400 text-sm mt-1">صمم صوراً تجذب المشاهدات باستخدام الذكاء الاصطناعي</p>
          </div>
          {(subjectImage || bgImage || title) && (
             <button 
               onClick={() => {
                 setSubjectImage(null);
                 setBgImage(null);
                 setResultImage(null);
                 setTitle('');
               }}
               className="text-sm text-red-400 hover:text-red-300"
             >
               بدء جديد
             </button>
          )}
        </div>

        <div className="p-6 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Inputs Column */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">عنوان الفيديو (يظهر في الصورة)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: كيف ربحت مليون دولار!"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Subject Image */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">صورة شخصية (اختياري)</label>
                <div 
                  onClick={() => subjectInputRef.current?.click()}
                  className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                    subjectImage ? 'border-red-500 bg-slate-900' : 'border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <input type="file" ref={subjectInputRef} onChange={(e) => handleFileUpload(e, setSubjectImage)} accept="image/*" className="hidden" />
                  {subjectImage ? (
                    <img src={subjectImage} alt="Subject" className="w-full h-full object-contain" />
                  ) : (
                    <>
                       <User className="text-slate-500 mb-2" />
                       <span className="text-slate-400 text-xs">اضغط لرفع صورتك</span>
                    </>
                  )}
                </div>
              </div>

              {/* Background Image */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">صورة خلفية (اختياري)</label>
                 <div 
                  onClick={() => bgInputRef.current?.click()}
                  className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                    bgImage ? 'border-red-500 bg-slate-900' : 'border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <input type="file" ref={bgInputRef} onChange={(e) => handleFileUpload(e, setBgImage)} accept="image/*" className="hidden" />
                  {bgImage ? (
                    <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
                  ) : (
                    <>
                       <ImageIcon className="text-slate-500 mb-2" />
                       <span className="text-slate-400 text-xs">اضغط لرفع خلفية</span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isProcessing || !title.trim()}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all ${
                  isProcessing || !title.trim()
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500 text-white hover:shadow-red-500/25'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" />
                    جاري التصميم...
                  </>
                ) : (
                  <>
                    <Youtube />
                    إنشاء المصغرة
                  </>
                )}
              </button>

            </div>

            {/* Result Column */}
            <div className="lg:col-span-2">
               <label className="block text-sm font-medium text-slate-400 mb-2">النتيجة (16:9)</label>
               <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative">
                  {isProcessing ? (
                    <div className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                         <div className="absolute inset-0 border-4 border-red-500/30 rounded-full animate-ping"></div>
                         <div className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-slate-400 animate-pulse">جاري تنسيق الصورة والنص...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full group">
                      <img src={resultImage} alt="YouTube Thumbnail" className="w-full h-full object-cover animate-in fade-in duration-700" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = resultImage;
                              link.download = `thumbnail-${Date.now()}.png`;
                              link.click();
                            }}
                            className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                          >
                            <Download size={18} /> تحميل
                          </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-600">
                      <Youtube className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>النتيجة ستظهر هنا</p>
                    </div>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeThumbnailMaker;