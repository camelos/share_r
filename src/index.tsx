import './index.css';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from 'framer-motion';
import { ChevronDown, Quote, Brain, ScrollText, Tv, Zap, MoveRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility --- 
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-yellow-400 origin-left z-50 mix-blend-difference"
      style={{ scaleX }}
    />
  );
};

const NoiseBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <section ref={ref} className="h-screen relative flex items-center justify-center overflow-hidden bg-zinc-950">
      <motion.div style={{ y, opacity, scale }} className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block text-yellow-500 font-mono text-lg mb-4 tracking-widest uppercase">A Visual History</span>
            <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none mb-6">
              THE LAST
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                LAUGH
              </span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto font-light serif leading-relaxed"
          >
            From ancient tablets to internet absurdism.
            <br /> How humanity evolved through humor.
          </motion.p>
        </div>
      </motion.div>

      {/* Abstract background elements */}
      <motion.div 
        style={{ y: textY }}
        className="absolute inset-0 opacity-20 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-overlay blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-overlay blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </motion.div>

      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Scroll to begin</span>
        <ChevronDown className="w-6 h-6 text-yellow-500" />
      </motion.div>
    </section>
  );
};

const StickySection = ({ children, title, icon: Icon }: { children: React.ReactNode, title: string, icon: any }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });

  return (
    <section ref={ref} className="relative py-32 md:py-64 bg-zinc-950">
      <div className="container mx-auto px-6 flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="md:w-1/3 relative">
          <div className="sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-4 text-yellow-500 mb-6"
            >
              <Icon className="w-8 h-8" />
              <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wider">{title}</h2>
            </motion.div>
            <motion.div 
              animate={{ height: isInView ? 100 : 0 }}
              className="w-1 bg-zinc-800 h-24 ml-4"
            >
               <motion.div 
                 className="w-full bg-yellow-500"
                 animate={{ height: isInView ? "100%" : "0%" }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
               />
            </motion.div>
          </div>
        </div>
        <div className="md:w-2/3">
          {children}
        </div>
      </div>
    </section>
  );
};

const TextReveal = ({ children, className }: { children: string, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -20% 0px", once: true });

  return (
    <p ref={ref} className={cn("text-zinc-300 leading-relaxed", className)}>
      {children.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.1, filter: "blur(8px)", y: 20 }}
          animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{ duration: 0.8, delay: i * 0.015, ease: "backOut" }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

const JokeCard = ({ date, location, content, delay = 0 }: { date: string, location: string, content: string, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -10% 0px", once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
      className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl mb-12 backdrop-blur-sm relative overflow-hidden group hover:border-yellow-500/50 transition-colors"
    >
      <div className="absolute -right-4 -top-4 text-zinc-800/30 group-hover:text-yellow-900/20 transition-colors">
        <Quote size={120} strokeWidth={1} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-yellow-500/70 font-mono text-sm mb-4 uppercase tracking-wider">
          <span>{date}</span>
          <span className="w-4 h-px bg-zinc-700" />
          <span>{location}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-serif text-zinc-100 italic leading-normal">
          &ldquo;{content}&rdquo;
        </h3>
      </div>
    </motion.div>
  );
};

const HorizontalEra = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const eras = [
    { title: "The Jester", year: "Middle Ages", desc: "Truth to power, masked by folly.", color: "bg-red-900" },
    { title: "The Satirist", year: "18th Century", desc: "Humor as a political weapon.", color: "bg-blue-900" },
    { title: "The Stand-up", year: "20th Century", desc: "The democratization of comedy.", color: "bg-purple-900" },
    { title: "The Meme", year: "Digital Age", desc: "Shared consciousness at light speed.", color: "bg-green-900" },
  ];

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-zinc-950">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x, opacity }} className="flex gap-4 p-20">
          <div className="w-[50vw] md:w-[30vw] shrink-0 flex flex-col justify-center px-12">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              THE<br/>SHIFTING<br/>SHAPE<br/>OF HUMOR
            </h2>
            <div className="flex items-center gap-4 text-yellow-500 animate-pulse">
              <span className="text-sm font-mono uppercase">Scroll Right</span>
              <MoveRight />
            </div>
          </div>
          {eras.map((era, i) => (
            <div key={i} className={cn("relative w-[80vw] md:w-[40vw] h-[70vh] shrink-0 rounded-3xl p-12 flex flex-col justify-end overflow-hidden border border-white/10", era.color)}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10">
                <span className="text-yellow-400 font-mono text-xl mb-2 block">{era.year}</span>
                <h3 className="text-4xl md:text-6xl font-bold text-white mb-4">{era.title}</h3>
                <p className="text-zinc-300 text-xl md:text-2xl font-light">{era.desc}</p>
              </div>
              <span className="absolute top-4 right-8 text-[12rem] font-black text-white/5 pointer-events-none">
                0{i + 1}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};


const MemeChaos = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [15, -15]);

  const memes = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    color: ["bg-pink-500", "bg-cyan-500", "bg-yellow-500", "bg-lime-500"][i % 4],
    text: ["LOL", "OMG", "WTF", "LMAO"][i % 4]
  }));

  return (
    <section ref={containerRef} className="relative min-h-[150vh] bg-zinc-950 overflow-hidden py-32 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/5 z-0" /> {/* Static noise placeholder */}
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mb-[40vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
           <Tv className="w-16 h-16 text-white mx-auto mb-8" />
           <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 mix-blend-difference">
             DIGITAL<br/>OVERLOAD
           </h2>
        </motion.div>
        <TextReveal className="text-2xl md:text-4xl text-white font-bold">
          In the internet age, humor accelerated. It became recursive, absurd, and infinitely replicable.
        </TextReveal>
      </div>

      <div className="absolute inset-0 pointer-events-none flex justify-between px-4 md:px-32 opacity-30">
        <motion.div style={{ y: y1, rotate: rotate1 }} className="flex flex-col gap-32 mt-96">
          {memes.slice(0, 4).map((m, i) => (
            <div key={i} className={cn("w-48 h-64 md:w-64 md:h-80 rounded-xl flex items-center justify-center font-black text-4xl text-black", m.color)}>
              {m.text}
            </div>
          ))}
        </motion.div>
        <motion.div style={{ y: y2, rotate: rotate2 }} className="flex flex-col gap-24 mt-32">
           {memes.slice(4, 8).map((m, i) => (
            <div key={i} className={cn("w-40 h-40 md:w-72 md:h-72 rounded-full flex items-center justify-center font-black text-4xl text-black", m.color)}>
              {m.text}
            </div>
          ))}
        </motion.div>
         <motion.div style={{ y: y3, rotate: rotate1 }} className="flex flex-col gap-48 mt-[50vh] hidden md:flex">
           {memes.slice(8, 12).map((m, i) => (
            <div key={i} className={cn("w-56 h-56 rounded-3xl rotate-12 flex items-center justify-center font-black text-4xl text-black", m.color)}>
              {m.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-zinc-950 text-zinc-500 py-32 text-center relative overflow-hidden">
    <div className="container mx-auto px-4 relative z-10">
      <Brain className="w-12 h-12 mx-auto mb-8 text-zinc-800" />
      <p className="text-2xl md:text-4xl font-serif italic text-zinc-300 mb-12 max-w-2xl mx-auto">
        "Against the assault of laughter, nothing can stand."
      </p>
      <p className="font-mono uppercase tracking-widest text-sm">
        Mark Twain
      </p>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-yellow-500/5 to-transparent" />
  </footer>
);


export default function HumorHistoryLongread() {
  useEffect(() => {
    // Smooth scroll behavior override for cleaner experience if desired
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 overflow-x-hidden selection:bg-yellow-500/30">
      <ScrollProgress />
      <NoiseBackground />

      <main>
        <Hero />

        <StickySection title="The Biology" icon={Brain}>
          <div className="prose prose-invert prose-lg md:prose-xl max-w-none">
            <TextReveal className="text-3xl md:text-5xl font-bold text-white mb-12 block leading-tight">
              Before we spoke, we laughed. It was a survival signal—a way to say \"false alarm.\" 
            </TextReveal>
            <p className="text-zinc-400 text-xl leading-relaxed mb-8">
              Evolutionary biologists suggest laughter predates human speech by millions of years. 
              It began not as a reaction to a joke, but as a primal signal of safety. 
              When danger passed, early hominids laughed to signal to the group that they could relax.
            </p>
            <div className="my-16 grid grid-cols-2 gap-4">
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="aspect-square bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center p-8 text-center"
                >
                  <span className="text-zinc-500 font-mono text-sm">Dopamine Release</span>
               </motion.div>
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="aspect-square bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center p-8 text-center"
                >
                  <span className="text-zinc-500 font-mono text-sm">Social Bonding</span>
               </motion.div>
            </div>
            <p className="text-zinc-400 text-xl leading-relaxed">
              Today, that ancient circuit is still active. We laugh 30 times more often when we are with others than when we are alone. It remains our most powerful social glue.
            </p>
          </div>
        </StickySection>

        <StickySection title="Ancient Giggles" icon={ScrollText}>
          <div className="max-w-3xl">
             <TextReveal className="text-4xl font-serif italic text-zinc-300 mb-16 block">
              If you think fart jokes are modern low-brow humor, think again. They are as old as civilization itself.
            </TextReveal>

            <JokeCard 
              date="1900 BC"
              location="Sumeria"
              content="Something which has never occurred since time immemorial; a young woman did not fart in her husband's lap."
            />
             <JokeCard 
              date="1600 BC"
              location="Ancient Egypt"
              content="How do you entertain a bored pharaoh? You sail a boatload of young women dressed only in fishing nets down the Nile and urge the pharaoh to go catch a fish."
              delay={0.2}
            />
            <JokeCard 
              date="4th Century BC"
              location="Greece"
              content="A barber, a bald man, and an absent-minded professor take a journey together. They have to camp overnight, and so agree to watch the luggage two hours at a time..."
              delay={0.4}
            />
          </div>
        </StickySection>

        <HorizontalEra />

        <StickySection title="Modern Absurdity" icon={Zap}>
           <div className="prose prose-invert prose-2xl max-w-none">
            <h3 className="text-5xl md:text-7xl font-black text-white mb-12">
              THE RULES<br /><span className="text-yellow-500">BROKE.</span>
            </h3>
            <p className="text-zinc-300 text-2xl leading-relaxed mb-8">
              The 20th century shattered traditional structures. Two World Wars and rapid industrialization made the old world seem ridiculous. 
              Dadaism, Surrealism, and later, postmodernism, asked: <span className="text-white font-bold italic">Why must it make sense?</span>
            </p>
          </div>
        </StickySection>

        <MemeChaos />
      </main>

      <Footer />
    </div>
  );
}
