interface MediaCardProps {
  title: string;
  category: string;
  image: string;
  type: "video" | "audio" | "book" | "image";
  description?: string;
  onClick?: () => void;
}

const MediaCard = ({ title, category, image, type, description, onClick }: MediaCardProps) => {
  const getBadgeStyle = () => {
    switch (type) {
      case "video":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "audio":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "book":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-purple-50 text-purple-700 border-purple-200";
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#FAFAFA] border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-150 flex flex-col h-full"
    >
      {/* Conteneur de l'image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Voile d'interaction épuré sans icône au survol */}
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenu textuel */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border rounded-md ${getBadgeStyle()}`}>
              {category}
            </span>
            {/* Affichage du type en texte seul sans icône */}
            <span className="text-slate-500 text-xs capitalize">
              {type}
            </span>
          </div>

          <h3 className="text-base font-semibold text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
            {title}
          </h3>

          {description && (
            <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;