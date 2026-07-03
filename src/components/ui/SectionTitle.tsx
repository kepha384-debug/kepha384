interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  noLine?: boolean;
  lightText?: boolean; // Nouvelle propriété pour basculer le texte en blanc
}

const SectionTitle = ({ 
  title, 
  subtitle, 
  align = "left", 
  noLine = false, 
  lightText = false 
}: SectionTitleProps) => {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"}`}>
      {/* Couleur conditionnelle : blanc si lightText est vrai, sinon gris sombre */}
      <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight flex flex-col gap-1 ${
        lightText ? "text-white" : "text-slate-800"
      }`}>
        <span>{title}</span>
        {!noLine && (
          <span className={`h-1 w-12 bg-amber-500 rounded-full mt-2.5 ${align === "center" ? "mx-auto" : ""}`} />
        )}
      </h2>
      {subtitle && (
        /* Couleur conditionnelle pour le sous-titre */
        <p className={`mt-2 text-sm md:text-base max-w-2xl leading-relaxed mx-auto ${
          lightText ? "text-slate-200" : "text-slate-600"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;