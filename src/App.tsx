import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MediaSection from './components/MediaSection';
import Footer from './components/Footer';
import VideoPlayerModal from './components/VideoPlayerModal';
import ContentModal from './components/ContentModal';
import AdminAuthModal from './components/AdminAuthModal';
import ContactModal from './components/ContactModal';
import DonationModal from './components/DonationModal';
import PrayerModal from './components/PrayerModal';
import AboutModal from './components/AboutModal';
import LegalModal from './components/LegalModal';
import VerseOfTheDay from './components/VerseOfTheDay';
import ScrollToTopButton from './components/ScrollToTopButton';
import CommentSection from './components/CommentSection';
import BibleReader from './components/BibleReader';
import type { MediaItem } from './types';
import { MediaType } from './types';
import { useLanguage } from './LanguageContext';

const STORAGE_VERSION = 'v138';
const DEFAULT_BANNER = "https://i.postimg.cc/3xRLjXjN/kepha03-3340x1880.png";
const BIBLE_COVER = "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop";
const TOB_COVER = "https://i.postimg.cc/CK023JsZ/40805.png";

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Erreur de lecture de la clé ${key}:`, e);
    return defaultValue;
  }
};

const safeSave = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert("Erreur : Espace de stockage saturé. Évitez les fichiers médias trop lourds localement.");
    }
  }
};

// Données initiales
const initialBiblicalMovies: MediaItem[] = [
  { id: 'm1', type: MediaType.MOVIE, title: 'media.title.m1', subtitle: 'media.subtitle.m1', description: 'media.desc.m1', imageUrl: "https://i.postimg.cc/pVmgSc9S/la-passion-du-christ-2400x3200.jpg", contentUrl: "https://player.mediadelivery.net/play/585951/515b73c4-6ee4-4790-ac83-519521319647", subtitleUrl: "https://drive.google.com/uc?export=download&id=1JscsjWKx9mqKE5CantFwrXrg06x7odMV" },
  { id: 'm_esther', type: MediaType.MOVIE, title: 'media.title.m_esther', subtitle: 'media.subtitle.m_esther', description: 'media.desc.m_esther', imageUrl: "https://i.postimg.cc/KcNX3KS0/Esther-480x720.png", contentUrl: "https://player.mediadelivery.net/play/585951/d1b129a7-afd0-493a-959c-4f2a7ed4a163" },
  { id: 'm_jeremie', type: MediaType.MOVIE, title: 'media.title.m_jeremie', subtitle: 'media.subtitle.m_jeremie', description: 'media.desc.m_jeremie', imageUrl: "https://i.postimg.cc/281rYW2W/jeremie_2560x1440.jpg", contentUrl: "https://player.mediadelivery.net/play/585951/1a5f944b-33db-4ae2-a4b0-3dee0ac5880e" },
  { id: 'm_samson', type: MediaType.MOVIE, title: 'media.title.m_samson', subtitle: 'media.subtitle.m_samson', description: 'media.desc.m_samson', imageUrl: "https://i.postimg.cc/85pL6f3h/Samson-480x720.png", contentUrl: "https://player.mediadelivery.net/play/585951/f7b7a48d-1458-4d35-a7f3-89513ad74c08" },
  { id: 'm_noah', type: MediaType.MOVIE, title: 'media.title.m_noah', subtitle: 'media.subtitle.m_noah', description: 'media.desc.m_noah', imageUrl: "https://i.postimg.cc/m2Ww15zY/Noah-480x720.png", contentUrl: "https://player.mediadelivery.net/play/585951/e7b7a48d-1458-4d35-a7f3-89513ad74c08" },
];

const initialOtherMovies: MediaItem[] = [
  { id: 'v_tem_1', type: MediaType.MOVIE, title: 'media.title.v_tem_1', subtitle: 'media.subtitle.v_tem_1', description: "media.desc.v_tem_1", imageUrl: 'https://i.postimg.cc/cJTfcjgT/2015_04_20_turinshroud_01_1780x1336.jpg', contentUrl: 'https://iframe.mediadelivery.net/play/599132/4fe7a48d-1458-4d35-a7f3-89513ad74c08' },
  { id: 'v_papes_1', type: MediaType.MOVIE, title: 'media.title.v_papes_1', subtitle: 'media.subtitle.v_papes_1', description: "media.desc.v_papes_1", imageUrl: 'https://i.postimg.cc/SNbgPFYP/Les-Papes.png', contentUrl: 'https://iframe.mediadelivery.net/play/599132/9e2a4c24-8166-4325-a554-cb383f107d3b' },
  { id: 'v_prophetie_1', type: MediaType.MOVIE, title: 'media.title.v_prophetie_1', subtitle: 'media.subtitle.v_prophetie_1', description: "media.desc.v_prophetie_1", imageUrl: 'https://i.postimg.cc/rpWYYVFJ/la-prophetie-des-papes.png', contentUrl: 'https://iframe.mediadelivery.net/play/599132/3be2741a-b05a-423d-8034-183a5bef7d7e' }
];

const initialAnimatedMovies: MediaItem[] = [
  { id: 'a1', type: MediaType.MOVIE, title: 'media.title.a1', subtitle: 'media.subtitle.a1', description: 'media.desc.a1', imageUrl: 'https://i.postimg.cc/mZjftwF6/voyage-du-pelerin-01.png', contentUrl: 'https://player.mediadelivery.net/play/585951/d1b129a7-afd0-493a-959c-4f2a7ed4a163' }
];

const initialMultimedia: MediaItem[] = [
  { id: 'v_tob_emission', type: MediaType.AUDIO, title: 'media.title.v_tob_emission', subtitle: 'media.subtitle.v_tob_emission', description: 'media.desc.v_tob_emission', imageUrl: 'https://i.postimg.cc/KYgpdBtH/90540.png', contentUrl: 'https://iframe.mediadelivery.net/play/599132/d790271a-8093-40a6-abbd-6d1b6419d047' }
];

const initialBooks: MediaItem[] = [
  { id: 'b_kjv', type: MediaType.BOOK, title: 'media.title.b_kjv', subtitle: 'media.subtitle.b_kjv', description: 'media.desc.b_kjv', imageUrl: BIBLE_COVER, contentUrl: 'internal:bible:kjv' },
  { id: 'b_tob_at', type: MediaType.BOOK, title: 'media.title.b_tob_at', subtitle: 'media.subtitle.b_tob_at', description: 'media.desc.b_tob_at', imageUrl: TOB_COVER, contentUrl: 'https://drive.google.com/file/d/1kDh_p__f0mMlEZQs7Q6YMd5CWdt_vyW6/preview' },
  { id: 'b_tob_nt', type: MediaType.BOOK, title: 'media.title.b_tob_nt', subtitle: 'media.subtitle.b_tob_nt', description: 'media.desc.b_tob_nt', imageUrl: TOB_COVER, contentUrl: 'https://drive.google.com/file/d/1CiEF2zUqorM24vTWDykxxBKqqYld4w1z/preview' },
  { id: 'b_drive_new', type: MediaType.BOOK, title: 'media.title.b_drive_new', subtitle: 'media.subtitle.b_drive_new', description: 'media.desc.b_drive_new', imageUrl: 'https://i.postimg.cc/kgBxpwqV/127109-bible-d-andre-chouraqui-1000.png', contentUrl: 'https://drive.google.com/file/d/1nScCuZnkx2rbCN2kmSFiThh20PQBm1W8/preview' },
  { id: 'b_imitation_jc', type: MediaType.BOOK, title: 'media.title.b_imitation_jc', subtitle: 'media.subtitle.b_imitation_jc', description: 'media.desc.b_imitation_jc', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop', contentUrl: 'https://drive.google.com/file/d/1_5GjN0XoM9E-yI7f_B6G9GzOqI-U_L0t/preview' },
  { id: 'b_voyage_pelerin', type: MediaType.BOOK, title: 'media.title.b_voyage_pelerin', subtitle: 'media.subtitle.b_voyage_pelerin', description: 'media.desc.b_voyage_pelerin', imageUrl: "https://i.postimg.cc/mZjftwF6/voyage-du-pelerin-01.png", contentUrl: "https://drive.google.com/file/d/1Sq0F8H6TU8zxuxQiSo-YyQ0KvBrZGdWL/preview" },
];

const initialImages: MediaItem[] = [
  { id: 'i_vm', type: MediaType.IMAGE, title: 'media.title.i_vm', subtitle: 'media.subtitle.i_vm', imageUrl: "https://i.postimg.cc/52BZpM1S/Vierge_Marie73.jpg", description: 'media.desc.i_vm' },
  { id: 'i_ej', type: MediaType.IMAGE, title: 'media.title.i_ej', subtitle: 'media.subtitle.i_ej', imageUrl: "https://i.postimg.cc/BnMs23Q8/enft_jhs_03.jpg", description: 'media.desc.i_ej' },
  { id: 'i_jc_titles_main', type: MediaType.IMAGE, title: 'media.title.i_jc_titles_main', subtitle: 'media.subtitle.i_jc_titles_main', imageUrl: "https://i.postimg.cc/L6qNtKk0/jesus_orig_03.jpg", description: 'media.desc.i_jc_titles_main' },
  { id: 'i_sj', type: MediaType.IMAGE, title: 'media.title.i_sj', subtitle: 'media.subtitle.i_sj', imageUrl: "https://i.postimg.cc/m2Ww15zY/Jean-Ferri-dessin.jpg", description: 'media.desc.i_sj' },
  { id: 'i_sp', type: MediaType.IMAGE, title: 'media.title.i_sp', subtitle: 'media.subtitle.i_sp', imageUrl: "https://i.postimg.cc/J7k84fm8/Pierre-Ferri-dessin.jpg", description: 'media.desc.i_sp' },
  { id: 'i_pa', type: MediaType.IMAGE, title: 'media.title.i_pa', subtitle: 'media.subtitle.i_pa', imageUrl: "https://i.postimg.cc/Bb2HSJJL/Saul-Lorenzo-Ferri-dessin.png", description: 'media.desc.i_pa' },
  { id: 'i_st', type: MediaType.IMAGE, title: 'media.title.i_st', subtitle: 'media.subtitle.i_st', imageUrl: "https://i.postimg.cc/cJTfcjgT/2015_04_20_turinshroud_01_1780x1336.jpg", description: 'media.desc.i_st' },
  { id: 'i_jn_scene', type: MediaType.IMAGE, title: 'media.title.i_jn_scene', subtitle: 'media.subtitle.i_jn_scene', imageUrl: "https://i.postimg.cc/W32WR5DY/Photo_miracle_33.jpg", description: 'media.desc.i_jn_scene' },
  { id: 'i_st_jacques', type: MediaType.IMAGE, title: 'media.title.i_st_jacques', subtitle: 'media.subtitle.i_st_jacques', imageUrl: "https://i.postimg.cc/pXbtwHwJ/300px-Jacques-Alphee-Ferri-02.jpg", description: 'media.desc.i_st_jacques' }
];

const sectionsConfig = [
  { id: 'histoires-bibliques', titleKey: 'section.biblical_movies', storageKey: 'biblical_movies' },
  { id: 'vie-chretienne', titleKey: 'section.other_movies', storageKey: 'other_movies' },
  { id: 'dessins-animes', titleKey: 'section.animated_movies', storageKey: 'animated_movies' },
  { id: 'multimedia', titleKey: 'section.multimedia', storageKey: 'multimedia' },
  { id: 'livres', titleKey: 'section.books', storageKey: 'books' },
  { id: 'images', titleKey: 'section.images', storageKey: 'images' },
];

const App: React.FC = () => {
  const { t } = useLanguage();

  // --- ÉTATS GÉNÉRAUX ---
  const [isAdmin, setIsAdmin] = useState(() => getInitialState(`mgts_is_admin_${STORAGE_VERSION}`, true));
  const [activeModal, setActiveModal] = useState<'auth' | 'contact' | 'donation' | 'prayer' | 'about' | 'legal' | null>(null);
  const [legalModalType, setLegalModalType] = useState<'mentions' | 'privacy'>('mentions');
  const [isBibleOpen, setIsBibleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- ÉTATS DES MÉDIAS (REGROUPÉS) ---
  const [media, setMedia] = useState<Record<string, MediaItem[]>>(() => ({
    'histoires-bibliques': getInitialState(`mgts_biblical_movies_${STORAGE_VERSION}`, initialBiblicalMovies),
    'vie-chretienne': getInitialState(`mgts_other_movies_${STORAGE_VERSION}`, initialOtherMovies),
    'dessins-animes': getInitialState(`mgts_animated_movies_${STORAGE_VERSION}`, initialAnimatedMovies),
    'multimedia': getInitialState(`mgts_multimedia_${STORAGE_VERSION}`, initialMultimedia),
    'livres': getInitialState(`mgts_books_${STORAGE_VERSION}`, initialBooks),
    'images': getInitialState(`mgts_images_${STORAGE_VERSION}`, initialImages),
  }));

  // --- ÉTATS BANNIÈRE & SÉLECTION ---
  const [bannerImageUrl, setBannerImageUrl] = useState(() => getInitialState(`mgts_banner_url_${STORAGE_VERSION}`, DEFAULT_BANNER));
  const [bannerLocalImage, setBannerLocalImage] = useState<string | null>(() => getInitialState(`mgts_banner_local_${STORAGE_VERSION}`, null));
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; item: MediaItem } | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // --- PERSISTANCE ---
  useEffect(() => safeSave(`mgts_is_admin_${STORAGE_VERSION}`, isAdmin), [isAdmin]);
  useEffect(() => safeSave(`mgts_banner_url_${STORAGE_VERSION}`, bannerImageUrl), [bannerImageUrl]);
  useEffect(() => safeSave(`mgts_banner_local_${STORAGE_VERSION}`, bannerLocalImage), [bannerLocalImage]);

  useEffect(() => {
    sectionsConfig.forEach(({ id, storageKey }) => {
      safeSave(`mgts_${storageKey}_${STORAGE_VERSION}`, media[id]);
    });
  }, [media]);

  // --- DÉPLACEMENT FLUIDE (SCROLL) ---
  const scrollToSection = (targetId: string) => {
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 120,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // --- ACTIONS SUR LES CONTENUS ---
  const handleItemClick = (item: MediaItem) => {
    if (item.contentUrl?.startsWith('internal:bible:')) {
      setIsBibleOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if ([MediaType.MOVIE, MediaType.VIDEO, MediaType.AUDIO].includes(item.type)) {
      setSelectedVideo({ url: item.contentUrl || '', item });
    } else {
      setSelectedItem(item);
    }
  };

  const handleEditItem = (updatedItem: MediaItem) => {
    setMedia(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        next[key] = next[key].map(item => item.id === updatedItem.id ? updatedItem : item);
      });
      return next;
    });
  };

  const handleDeleteItem = (id: string) => {
    setMedia(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        next[key] = next[key].filter(item => item.id !== id);
      });
      return next;
    });
  };

  const handleAddItem = (sectionId: string) => {
    const newItem: MediaItem = {
      id: `new-${Date.now()}`,
      type: sectionId === 'livres' ? MediaType.BOOK : sectionId === 'images' ? MediaType.IMAGE : MediaType.MOVIE,
      title: 'Nouveau contenu',
      subtitle: '',
      description: 'Ajoutez une description ici...',
      imageUrl: null,
      contentUrl: null
    };
    setMedia(prev => ({ ...prev, [sectionId]: [newItem, ...prev[sectionId]] }));
  };

  const handleMoveItem = (sectionId: string, id: string, direction: 'up' | 'down') => {
    setMedia(prev => {
      const list = prev[sectionId];
      const index = list.findIndex(item => item.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const newList = [...list];
      [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
      return { ...prev, [sectionId]: newList };
    });
  };

  const handleReset = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  const openLegalModal = (type: 'mentions' | 'privacy') => {
    setLegalModalType(type);
    setActiveModal('legal');
  };

  // --- RECHERCHE ET FILTRE ---
  const filteredMedia = useMemo(() => {
    const result: Record<string, MediaItem[]> = {};
    Object.keys(media).forEach(key => {
      result[key] = media[key].filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          t(item.title).toLowerCase().includes(q) ||
          (item.subtitle && t(item.subtitle).toLowerCase().includes(q)) ||
          t(item.description).toLowerCase().includes(q)
        );
      });
    });
    return result;
  }, [media, searchQuery, t]);

  return (
    <div id="accueil" className="min-h-screen bg-slate-950 text-slate-200 selection:bg-yellow-500/30">
      <Header 
        onSearch={setSearchQuery} 
        onOpenContact={() => setActiveModal('contact')}
        onOpenDonation={() => setActiveModal('donation')}
        onOpenPrayer={() => setActiveModal('prayer')}
        onOpenAbout={() => setActiveModal('about')}
        onOpenAuth={() => setActiveModal('auth')}
        onCloseBible={(targetId) => {
          setIsBibleOpen(false);
          if (targetId) scrollToSection(targetId);
        }}
        isBibleOpen={isBibleOpen}
        isAdmin={isAdmin}
      />
      
      <main className={isBibleOpen ? "h-screen overflow-hidden pt-10" : "pt-[104px]"}>
        {isBibleOpen ? (
          <BibleReader onClose={() => {
            setIsBibleOpen(false);
            scrollToSection('livres');
          }} />
        ) : (
          <>
            <Hero 
              bannerImageUrl={bannerImageUrl}
              bannerLocalImage={bannerLocalImage}
              onBannerChange={setBannerImageUrl}
              onLocalBannerChange={setBannerLocalImage}
              isAdmin={isAdmin}
            />
            
            <VerseOfTheDay />

            <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-16">
              {sectionsConfig.map(({ id, titleKey }) => (
                <MediaSection 
                  key={id}
                  id={id}
                  title={t(titleKey)} 
                  items={filteredMedia[id] || []} 
                  onItemClick={handleItemClick}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                  onMoveItem={(itemId, dir) => handleMoveItem(id, itemId, dir)}
                  isAdmin={isAdmin}
                  onAddItem={() => handleAddItem(id)}
                />
              ))}

              <CommentSection />
            </div>
          </>
        )}
      </main>

      {!isBibleOpen && (
        <Footer 
          isAdmin={isAdmin} 
          onOpenAuth={() => setActiveModal('auth')}
          onLogoutAdmin={() => setIsAdmin(false)}
          onOpenContact={() => setActiveModal('contact')}
          onOpenDonation={() => setActiveModal('donation')}
          onOpenAbout={() => setActiveModal('about')}
          onOpenLegal={() => openLegalModal('mentions')}
          onOpenPrivacy={() => openLegalModal('privacy')}
          onReset={handleReset}
        />
      )}

      {selectedVideo && (
        <VideoPlayerModal 
          videoUrl={selectedVideo.url} 
          posterUrl={selectedVideo.item.imageUrl}
          subtitleUrl={selectedVideo.item.subtitleUrl}
          onClose={() => setSelectedVideo(null)} 
        />
      )}

      {selectedItem && (
        <ContentModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onPlayVideo={(url, item) => {
            setSelectedItem(null);
            if (url.startsWith('internal:bible:')) {
              setIsBibleOpen(true);
            } else {
              setSelectedVideo({ url, item });
            }
          }}
        />
      )}

      {/* Rendu unifié des Modals */}
      {activeModal === 'auth' && (
        <AdminAuthModal 
          onClose={() => setActiveModal(null)} 
          onSuccess={() => { setIsAdmin(true); setActiveModal(null); }} 
        />
      )}
      {activeModal === 'contact' && <ContactModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'donation' && <DonationModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'prayer' && <PrayerModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'about' && <AboutModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'legal' && (
        <LegalModal isOpen={true} onClose={() => setActiveModal(null)} type={legalModalType} />
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default App;