import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import ImageGenerator from './components/ImageGenerator';
import ImageEnhancer from './components/ImageEnhancer';
import BackgroundRemover from './components/BackgroundRemover';
import ImageMerger from './components/ImageMerger';
import ImageMontage from './components/ImageMontage';
import YouTubeThumbnailMaker from './components/YouTubeThumbnailMaker';
import InstagramPostMaker from './components/InstagramPostMaker';
import ArtisticEffects from './components/ArtisticEffects';
import FaceBlur from './components/FaceBlur';
import LogoMaker from './components/LogoMaker';
import ConsistentCharacter from './components/ConsistentCharacter';
import BackgroundChanger from './components/BackgroundChanger';
import BrandIdentityMaker from './components/BrandIdentityMaker';
import FaceSwap from './components/FaceSwap';
import Gallery from './components/Gallery';
import { GeneratedImage } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const handleImageGenerated = (image: GeneratedImage) => {
    setGeneratedImages((prev) => [image, ...prev]);
  };

  const handleDeleteImage = (id: string) => {
    setGeneratedImages((prev) => prev.filter(img => img.id !== id));
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'home': return <Home onStart={() => setActiveTab('generate')} />;
        case 'generate': return <ImageGenerator onImageGenerated={handleImageGenerated} />;
        case 'insta-post': return <InstagramPostMaker onImageGenerated={handleImageGenerated} />;
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
                <div className="max-w-4xl mx-auto p-8 text-center bg-white border border-gray-200 shadow-xl rounded-3xl mt-10">
                  <div className="mb-4 text-6xl">⚙️</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h2>
                  <p className="text-gray-500">Configuration module not loaded yet.</p>
                </div>
            );
        default: return <Home onStart={() => setActiveTab('generate')} />;
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