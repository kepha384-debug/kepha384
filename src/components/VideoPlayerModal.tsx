
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XIcon } from './icons/MenuIcons';
import type { MediaItem } from '../types';

interface VideoPlayerModalProps {
  videoUrl: string;
  posterUrl?: string | null;
  subtitleUrl?: string | null;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ 
  videoUrl, 
  posterUrl, 
  subtitleUrl, 
  onClose 
}) => {

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/95 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/60 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <iframe
          src={videoUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video Player"
        />
      </motion.div>
    </div>
  );
};

export default VideoPlayerModal;
