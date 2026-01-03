import React, { useState, useRef } from 'react';
import { RefreshCcw, User, Loader2, Download, ImagePlus, ArrowRight, Terminal } from 'lucide-react';
import { swapFaces } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface FaceSwapProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const FaceSwap: React.FC<FaceSwapProps> = ({ onImageGenerated }) => {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const faceInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

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

  const handleSwap = async () => {
    if (!faceImage || !targetImage) return;

    setIsProcessing(true);
    
    try {
      const result = await swapFaces(faceImage, targetImage);
      setResultImage(result);
      
      onImageGenerated({
        id: Date.now().toString(),
        url: result,
        prompt: `Face Swap`,
        aspectRatio: '1:1',
        createdAt: new Date(),
        model: 'gemini-2.5-flash-image (FaceSwap)'
      });

    } catch (error) {
      alert("حدث خطأ أثناء تبديل الوجوه. يرجى التأكد من أن الصور واضحة.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-black uppercase font-['Press_Start_2P'] flex items-center gap-2 leading-relaxed">
                FACE <span className="bg-[#FF0000] text-white px-2">SWAPPER</span>
              </h2>
              <p className="text-black font-bold font-['Space_Mono'] mt-2">> INITIALIZE_SWAP_PROTOCOL</p>
            </div>
             {(faceImage || targetImage) && (
               <button 
                 onClick={() => {
                   setFaceImage(null);
                   setTargetImage(null);
                   setResultImage(null);
                 }}
                 className="text-sm font-bold text-red-600 hover:text-black uppercase border-b-2 border-transparent hover:border-black"
               >
                 [ RESET ]
               </button>
            )}
          </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
          
          {/* Inputs Section */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center">
            
            {/* Face Source */}
            <div 
              onClick={() => faceInputRef.current?.click()}
              className={`flex-1 min-h-[300px] bg-white border-4 border-black flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
                faceImage ? 'shadow-[8px_8px_0px_0px_#FF0000]' : 'hover:shadow-[8px_8px_0px_0px_#000]'
              }`}
            >
              <input type="file" ref={faceInputRef} onChange={(e) => handleFileUpload(e, setFaceImage)} accept="image/*" className="hidden" />
              {faceImage ? (
                <>
                  <img src={faceImage} alt="Face Source" className="w-full h-full object-contain p-2" />
                  <div className="absolute top-0 left-0 bg-black text-white text-xs font-bold px-3 py-1 border-b-2 border-r-2 border-white">SOURCE_FACE</div>
                </>
              ) : (
                <>
                   <User className="text-black mb-3 w-16 h-16 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                   <span className="text-black font-black uppercase text-xl">1. SOURCE FACE</span>
                   <span className="text-gray-500 font-bold text-xs mt-2 font-['Space_Mono']">UPLOAD IMAGE</span>
                </>
              )}
            </div>

            {/* Arrow Icon */}
            <div className="flex items-center justify-center text-black">
              <ArrowRight size={48} className="hidden md:block" strokeWidth={3} />
              <ArrowRight size={48} className="md:hidden transform rotate-90" strokeWidth={3} />
            </div>

            {/* Target Body */}
             <div 
              onClick={() => targetInputRef.current?.click()}
              className={`flex-1 min-h-[300px] bg-white border-4 border-black flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
                targetImage ? 'shadow-[8px_8px_0px_0px_#FF0000]' : 'hover:shadow-[8px_8px_0px_0px_#000]'
              }`}
            >
              <input type="file" ref={targetInputRef} onChange={(e) => handleFileUpload(e, setTargetImage)} accept="image/*" className="hidden" />
              {targetImage ? (
                <>
                  <img src={targetImage} alt="Target Body" className="w-full h-full object-contain p-2" />
                  <div className="absolute top-0 left-0 bg-black text-white text-xs font-bold px-3 py-1 border-b-2 border-r-2 border-white">TARGET_BODY</div>
                </>
              ) : (
                <>
                   <ImagePlus className="text-black mb-3 w-16 h-16 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                   <span className="text-black font-black uppercase text-xl">2. TARGET SCENE</span>
                   <span className="text-gray-500 font-bold text-xs mt-2 font-['Space_Mono']">UPLOAD IMAGE</span>
                </>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
                onClick={handleSwap}
                disabled={isProcessing || !faceImage || !targetImage}
                className={`w-full md:w-1/2 py-5 border-4 border-black flex items-center justify-center gap-3 font-black text-xl uppercase transition-all ${
                  isProcessing || !faceImage || !targetImage
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                    : 'bg-[#FF0000] text-white shadow-[8px_8px_0px_0px_#000] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" />
                    SWAPPING...
                  </>
                ) : (
                  <>
                    <RefreshCcw />
                    EXECUTE SWAP
                  </>
                )}
            </button>
          </div>

          {/* Result Section */}
          {resultImage && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="bg-white border-4 border-black p-2 shadow-[12px_12px_0px_0px_#000]">
                 <div className="flex justify-between items-center bg-black text-white p-3 mb-2">
                    <h3 className="text-lg font-bold font-['Space_Mono']">> FINAL_RESULT</h3>
                    <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = resultImage;
                            link.download = `faceswap-${Date.now()}.png`;
                            link.click();
                          }}
                          className="text-white hover:text-[#FF0000] uppercase font-bold text-sm flex items-center gap-2"
                        >
                          <Download size={18} /> DOWNLOAD
                    </button>
                 </div>
                 <div className="aspect-square bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-gray-50 flex items-center justify-center relative border-2 border-black">
                    <img src={resultImage} alt="Face Swap Result" className="w-full h-full object-contain" />
                 </div>
               </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default FaceSwap;