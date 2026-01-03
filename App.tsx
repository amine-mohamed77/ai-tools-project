import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import ToolsHub from './components/ToolsHub';
import ImageGenerator from './components/ImageGenerator';
import ImageEnhancer from './components/ImageEnhancer';
import BackgroundRemover from './components/BackgroundRemover';
import ImageMerger from './components/ImageMerger';
import ImageMontage from './components/ImageMontage';
import YouTubeThumbnailMaker from './components/YouTubeThumbnailMaker';
import AdsGenerator from './components/AdsGenerator';
import ArtisticEffects from './components/ArtisticEffects';
import FaceBlur from './components/FaceBlur';
import LogoMaker from './components/LogoMaker';
import ConsistentCharacter from './components/ConsistentCharacter';
import BackgroundChanger from './components/BackgroundChanger';
import BrandIdentityMaker from './components/BrandIdentityMaker';
import FaceSwap from './components/FaceSwap';
import Gallery from './components/Gallery';
import ChatBot from './components/ChatBot';
import { GeneratedImage } from './types';
import { useLanguage } from './contexts/LanguageContext';
import { Globe } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  const { language, setLanguage, t } = useLanguage();

  const handleImageGenerated = (image: GeneratedImage) => {
    setGeneratedImages((prev) => [image, ...prev]);
  };

  const handleDeleteImage = (id: string) => {
    setGeneratedImages((prev) => prev.filter(img => img.id !== id));
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'home': return <Home onStart={() => setActiveTab('tools-hub')} />;
        case 'chat': return <ChatBot />;
        
        // Ads Market Routes
        case 'ads-creator': return <AdsGenerator onImageGenerated={handleImageGenerated} category="social" />;
        case 'ads-product': return <AdsGenerator onImageGenerated={handleImageGenerated} category="product" />;
        case 'ads-social': return <AdsGenerator onImageGenerated={handleImageGenerated} category="social" />;
        case 'ads-smart': return <AdsGenerator onImageGenerated={handleImageGenerated} category="smart" />;
        case 'ads-opt': return <AdsGenerator onImageGenerated={handleImageGenerated} category="opt" />;
        case 'ads-ab': return <AdsGenerator onImageGenerated={handleImageGenerated} category="ab" />;
        case 'ads-premium': return <AdsGenerator onImageGenerated={handleImageGenerated} category="premium" />;
        
        case 'tools-hub': return <ToolsHub onSelectTool={(id) => setActiveTab(id)} />;
        
        // Tools Sub-routes
        case 'generate': return <ImageGenerator onImageGenerated={handleImageGenerated} />;
        case 'face-swap': return <FaceSwap onImageGenerated={handleImageGenerated} />;
        case 'brand-identity': return <BrandIdentityMaker onImageGenerated={handleImageGenerated} />;
        case 'consistent-char': return <ConsistentCharacter onImageGenerated={handleImageGenerated} />;
        case 'change-bg': return <BackgroundChanger onImageGenerated={handleImageGenerated} />;
        case 'logo': return <LogoMaker onImageGenerated={handleImageGenerated} />;
        case 'effects': return <ArtisticEffects onImageGenerated={handleImageGenerated} />;
        case 'blur-face': return <FaceBlur onImageGenerated={handleImageGenerated} />;
        case 'montage': return <ImageMontage onImageGenerated={handleImageGenerated} />;
        case 'thumbnail': return <YouTubeThumbnailMaker onImageGenerated={handleImageGenerated} />;
        case 'enhance': return <ImageEnhancer onImageGenerated={handleImageGenerated} />;
        case 'remove-bg': return <BackgroundRemover onImageGenerated={handleImageGenerated} />;
        case 'merge': return <ImageMerger onImageGenerated={handleImageGenerated} />;
        
        case 'gallery': return <Gallery images={generatedImages} onDelete={handleDeleteImage} />;
        case 'settings': 
            return (
                <div className="max-w-2xl mx-auto mt-10">
                   <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
                       <h2 className="text-2xl font-black text-black uppercase font-['Press_Start_2P'] mb-6 flex items-center gap-3">
                           <Globe size={24} /> {t('settings_title')}
                       </h2>
                       
                       <div className="space-y-6">
                           <div className="border-b-2 border-gray-100 pb-6">
                               <label className="block text-sm font-bold text-gray-500 uppercase mb-3">
                                   {t('settings_lang')}
                               </label>
                               <div className="grid grid-cols-2 gap-4">
                                   <button 
                                       onClick={() => setLanguage('ar')}
                                       className={`p-4 border-2 border-black font-bold uppercase transition-all ${
                                           language === 'ar' 
                                           ? 'bg-black text-white shadow-[4px_4px_0px_0px_#FF5500]' 
                                           : 'bg-white hover:bg-gray-50'
                                       }`}
                                   >
                                       {t('settings_lang_ar')}
                                   </button>
                                   <button 
                                       onClick={() => setLanguage('en')}
                                       className={`p-4 border-2 border-black font-bold uppercase transition-all ${
                                           language === 'en' 
                                           ? 'bg-black text-white shadow-[4px_4px_0px_0px_#FF5500]' 
                                           : 'bg-white hover:bg-gray-50'
                                       }`}
                                   >
                                       {t('settings_lang_en')}
                                   </button>
                               </div>
                           </div>
                           
                           <div>
                               <p className="text-xs text-gray-400 font-mono">
                                   System ID: 8842-X-PREMIUM<br/>
                                   Version: 3.1.0 (Stable)
                               </p>
                           </div>
                       </div>
                   </div>
                </div>
            );
        default: return <Home onStart={() => setActiveTab('tools-hub')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 font-inter overflow-x-hidden flex">
      
      {/* Sidebar - Desktop (Static) */}
      <div className="hidden md:block w-72 flex-shrink-0 relative z-40">
        <div className="fixed inset-y-0 w-72">
          <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              closeSidebar={() => setIsSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Sidebar - Mobile (Drawer) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className="relative w-72 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out animate-in slide-in-from-left">
             <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                closeSidebar={() => setIsSidebarOpen(false)}
             />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header - Transparent/Sticky */}
        <Header 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            goHome={() => setActiveTab('home')}
        />
        
        {/* Scrollable Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
           <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
             {renderContent()}
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;