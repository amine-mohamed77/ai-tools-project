import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Eraser, Loader2, Download, ArrowRightLeft, ImagePlus } from 'lucide-react';
import { editImage } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface ImageEditorProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onImageGenerated }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
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

  const handleEdit = async (action: 'enhance' | 'remove-bg') => {
    if (!originalImage) return;

    setIsProcessing(true);
    setActiveAction(action);
    
    let prompt = "";
    if (action === 'enhance') {
      prompt = "Enhance the quality of this image, make it high resolution, sharper details, professional lighting, 4k quality.";
    } else if (action === 'remove-bg') {
      prompt = "Isolate the main subject of this image and place it on a pure white background. Keep the subject details exactly the same.";
    }

    try {
      const result = await editImage(originalImage, prompt);
      setEditedImage(result);
      
      // Save to gallery automatically
      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: action === 'enhance' ? 'تحسين جودة الصورة' : 'إزالة الخلفية',
        aspectRatio: '1:1', // Aspect ratio is preserved usually
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (Edit)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-purple-400" />
              أستوديو التعديل الذكي
            </h2>
            <p className="text-slate-400 text-sm mt-1">قم بتحسين صورك أو إزالة الخلفية باستخدام الذكاء الاصطناعي</p>
          </div>
          {originalImage && (
             <button 
               onClick={() => {
                 setOriginalImage(null);
                 setEditedImage(null);
               }}
               className="text-sm text-red-400 hover:text-red-300"
             >
               مسح وبدء جديد
             </button>
          )}
        </div>

        <div className="p-6">
          {!originalImage ? (
            // Upload State
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
              <p className="text-slate-500">أو اسحب الصورة هنا (PNG, JPG)</p>
            </div>
          ) : (
            // Editor State
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Original Image */}
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>الصورة الأصلية</span>
                </div>
                <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative">
                  <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleEdit('enhance')}
                    disabled={isProcessing}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      activeAction === 'enhance' 
                        ? 'bg-purple-600 border-purple-500 text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    } disabled:opacity-50`}
                  >
                    {activeAction === 'enhance' ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    <span className="font-bold">تحسين الجودة</span>
                  </button>

                  <button
                    onClick={() => handleEdit('remove-bg')}
                    disabled={isProcessing}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      activeAction === 'remove-bg' 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    } disabled:opacity-50`}
                  >
                    {activeAction === 'remove-bg' ? <Loader2 className="animate-spin" /> : <Eraser />}
                    <span className="font-bold">عزل الخلفية</span>
                  </button>
                </div>
              </div>

              {/* Result Image */}
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>النتيجة</span>
                  {editedImage && (
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = editedImage;
                        link.download = `edited-${Date.now()}.png`;
                        link.click();
                      }}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Download size={14} /> تحميل
                    </button>
                  )}
                </div>
                <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center relative">
                  {isProcessing ? (
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                      <p className="text-slate-400">جاري المعالجة...</p>
                    </div>
                  ) : editedImage ? (
                    <img src={editedImage} alt="Edited" className="w-full h-full object-contain animate-in fade-in" />
                  ) : (
                    <div className="text-center text-slate-600">
                      <ArrowRightLeft className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>اختر أداة لرؤية النتيجة هنا</p>
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

export default ImageEditor;