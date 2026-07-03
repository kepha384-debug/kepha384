const Hero = () => {
  return (
    <section
      className="relative h-[60vh] md:h-[75vh] bg-cover bg-center flex items-end justify-start overflow-hidden"
      style={{
        backgroundImage:
          "url('https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/ma%20gr%C3%82ce%20te%20suffit%20!.png')",
      }}
    >
      {/* Overlay de fondu noir pour connecter harmonieusement l'image au fond du site */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/0 to-slate-950/10" />
      
    </section>
  );
};

export default Hero;