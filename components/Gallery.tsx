import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Clock, Trash2 } from 'lucide-react';

interface GalleryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
          <Clock size={48} className="opacity-50" />
        </div>
        <p className="text-xl font-medium">لا توجد صور محفوظة في السجل</p>
        <p className="mt-2 text-sm">الصور التي تقوم بتوليدها ستظهر هنا</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">معرض أعمالك</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
            <div className="aspect-square relative overflow-hidden bg-slate-900">
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                 <div className="flex justify-between items-center gap-2">
                    <button 
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = img.url;
                            link.download = `archive-${img.id}.png`;
                            link.click();
                        }}
                        className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white"
                        title="تحميل"
                    >
                        <Download size={18} />
                    </button>
                    <button 
                        onClick={() => onDelete(img.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-lg text-red-200"
                        title="حذف"
                    >
                        <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-300 line-clamp-2 mb-2 font-medium">{img.prompt}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{new Date(img.createdAt).toLocaleDateString('ar-EG')}</span>
                <span className="bg-slate-700/50 px-2 py-1 rounded text-slate-400 uppercase">{img.aspectRatio}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;