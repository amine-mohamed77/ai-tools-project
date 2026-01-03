import React, { useState } from 'react';
import { Wand2, Download, Share2, ImageIcon, Loader2, Sparkles, AlertCircle, Terminal } from 'lucide-react';
import { GeneratedImage, AspectRatio, GenerationModel } from '../types';
import { generateImageFromPrompt } from '../services/geminiService';

interface ImageGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [model, setModel] = useState<GenerationModel>(GenerationModel.FAST);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      const base64Image = await generateImageFromPrompt({
        prompt,
        aspectRatio,
        model
      });

      setCurrentImage(base64Image);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: base64Image,
        prompt: prompt,
        aspectRatio: aspectRatio,
        createdAt: new Date(),
        model: model
      };
      
      onImageGenerated(newImage);

    } catch (err: any) {
      setError(err.message || "فشلت عملية التوليد. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `neura-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Title Block */}
      <div className="mb-8 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000]">
        <h1 className="text-4xl font-black uppercase font-['Press_Start_2P'] leading-relaxed">
          AI <span className="text-[#FF0000] bg-black px-2">GENERATOR</span>
        </h1>
        <p className="font-['Space_Mono'] font-bold mt-2 text-lg">
          > INPUT_PROMPT // GET_ART
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_#000] relative">
            {/* Decoration Tag */}
            <div className="absolute -top-4 -right-4 bg-[#FF0000] text-white px-4 py-1 font-bold border-2 border-black transform rotate-3 shadow-[4px_4px_0px_0px_#000]">
              CONTROL_PANEL
            </div>

            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono'] flex items-center gap-2">
                   <Terminal size={16} /> Enter Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="DESCRIBE THE GLITCH..."
                  className="w-full h-40 bg-gray-50 border-4 border-black p-4 text-black font-bold placeholder-gray-400 focus:ring-0 focus:border-[#FF0000] resize-none text-lg font-['Space_Mono']"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono']">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-3">
                  {[AspectRatio.SQUARE, AspectRatio.LANDSCAPE, AspectRatio.PORTRAIT, AspectRatio.WIDE].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`p-3 border-2 border-black font-bold text-sm transition-all ${
                        aspectRatio === ratio
                          ? 'bg-black text-white shadow-[4px_4px_0px_0px_#FF0000]'
                          : 'bg-white text-black hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_#000]'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase font-['Space_Mono']">Model Speed</label>
                <div className="border-4 border-black p-1 bg-white">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as GenerationModel)}
                    className="w-full bg-transparent border-none font-bold text-black focus:ring-0 uppercase cursor-pointer"
                  >
                    <option value={GenerationModel.FAST}>⚡ FAST (FLASH 2.5)</option>
                    <option value={GenerationModel.HD}>💎 HD (PRO 3.0)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-5 border-4 border-black flex items-center justify-center gap-3 font-black text-xl uppercase transition-all ${
                  isGenerating || !prompt.trim()
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500 border-gray-500'
                    : 'bg-[#FF0000] text-white shadow-[8px_8px_0px_0px_#000] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] hover:bg-red-500'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={24} strokeWidth={3} />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <Wand2 size={24} strokeWidth={3} />
                    GENERATE
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-7">
          <div className="bg-white p-2 border-4 border-black h-full min-h-[600px] flex flex-col shadow-[12px_12px_0px_0px_#000]">
            <div className="flex justify-between items-center bg-black text-white p-3 mb-2">
              <h3 className="text-lg font-bold font-['Space_Mono']">> OUTPUT_TERMINAL</h3>
              {currentImage && (
                <div className="flex gap-2">
                  <button onClick={downloadImage} className="p-1 hover:text-[#FF0000] transition-colors" title="SAVE">
                    <Download size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-gray-100 border-2 border-black flex items-center justify-center relative overflow-hidden">
              {isGenerating ? (
                <div className="text-center p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000]">
                  <Loader2 className="animate-spin w-16 h-16 text-[#FF0000] mx-auto mb-4" strokeWidth={3} />
                  <p className="font-['Press_Start_2P'] text-xs animate-pulse">RENDERING PIXELS...</p>
                </div>
              ) : currentImage ? (
                <img
                  src={currentImage}
                  alt="Generated Art"
                  className="w-full h-full object-contain animate-in zoom-in-95 duration-300"
                />
              ) : error ? (
                 <div className="text-center max-w-md p-6 bg-[#FF0000] text-white border-4 border-black shadow-[8px_8px_0px_0px_#000]">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-bold text-xl uppercase mb-2">SYSTEM ERROR</p>
                    <p className="font-mono text-sm">{error}</p>
                 </div>
              ) : (
                <div className="text-center p-8 opacity-50">
                  <ImageIcon className="w-24 h-24 mx-auto mb-4 text-black" strokeWidth={1} />
                  <h4 className="text-2xl font-black uppercase font-['Space_Mono']">NO SIGNAL</h4>
                  <p className="font-bold mt-2">Waiting for input...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;