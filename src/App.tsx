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
import Legal from "./pages/Legal";
import Priere from "./pages/Priere";
import Temoignages from "./pages/Temoignages";
import Don from "./pages/Don";

/* ------------------------------
   Scroll automatique lors d'un changement de route
--------------------------------*/
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

/* ------------------------------
   Bouton flottant Retour en haut
--------------------------------*/
function ScrollButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollSmooth = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollSmooth}
      aria-label="Retour en haut"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-amber-500 text-slate-950 
        border border-amber-500 shadow-lg shadow-black/20 
        hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-400/50 
        transition-all duration-300
        ${visible ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
      `}
    >
      <ArrowUp size={20} className="stroke-[2.5px]" />
    </button>
  );
}

/* ------------------------------
   Application principale
--------------------------------*/
function App() {
  return (
    <BrowserRouter>
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
            <Route path="/legal" element={<Legal />} />
            <Route path="/don" element={<Don />} />
          </Routes>
        </main>

        <Footer />

        <ScrollButton />
      </div>
    </BrowserRouter>
  );
}

export default App;