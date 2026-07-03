import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import FilmsAnimations from "./pages/FilmsAnimations";
import DocumentairesTemoignages from "./pages/DocumentairesTemoignages";
import MultimediaAudio from "./pages/MultimediaAudio";
import BibliothequeNumerique from "./pages/BibliothequeNumerique";
import Galerie from "./pages/Galerie";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Legal from "./pages/Legal"; // Importation de la page Mentions légales (vérifiez la majuscule "L" du fichier)
import Priere from "./pages/Priere";
import Temoignages from "./pages/Temoignages";
import Don from "./pages/Don"; 

// Utilitaire de retour en haut de page instantané lors d'un changement de route
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <BrowserRouter>
      {/* Exécution du retour en haut instantané */}
      <ScrollToTop />

      <div className="min-h-screen flex flex-col bg-[#020917] text-white relative">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Sections multimédias */}
            <Route path="/films" element={<FilmsAnimations />} />
            <Route path="/documentaires" element={<DocumentairesTemoignages />} />
            <Route path="/audio" element={<MultimediaAudio />} />
            <Route path="/livres" element={<BibliothequeNumerique />} />
            <Route path="/galerie" element={<Galerie />} />
            <Route path="/priere" element={<Priere />} />
            <Route path="/temoignages" element={<Temoignages />} />

            {/* Pages générales */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/legal" element={<Legal />} /> {/* Route déclarée pointant vers /legal */}
            <Route path="/don" element={<Don />} /> 
          </Routes>
        </main>

        <Footer />

        {/* Bouton de retour en haut flottant */}
        <button
          onClick={scrollToTopSmooth}
          className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-amber-500 text-slate-950 border border-amber-500 shadow-lg shadow-black/20 hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-400/50 transition-all duration-300 ${
            showScrollButton 
              ? "opacity-100 scale-100 hover:scale-110 pointer-events-auto" 
              : "opacity-0 scale-95 pointer-events-none"
          }`}
          aria-label="Retour en haut de page"
        >
          <ArrowUp size={20} className="stroke-[2.5px]" />
        </button>
      </div>
    </BrowserRouter>
  );
}

export default App;