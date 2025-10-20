import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  MotionValue,
} from 'framer-motion';
import { ArrowDown, Smile, Frown, Zap, Skull, MousePointerClick } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Shared Components ---

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

interface ParallaxTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  className?: string;
}

function ParallaxText({ children, baseVelocity = 100, className }: ParallaxTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div className={cn("flex whitespace-nowrap flex-nowrap", className)} style={{ x }}>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
      </motion.div>
    </div>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// --- Sections ---

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  // Mouse parallax effect
  const x = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    x.set((clientX / innerWidth - 0.5) * 50);
    mouseY.set((clientY / innerHeight - 0.5) * 50);
  };

  return (
    <motion.section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen overflow-hidden bg-zinc-900 text-[#E0FF00] flex flex-col items-center justify-center border-b-8 border-black"
      style={{ opacity }}
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #E0FF00 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          x: useTransform(x, (val) => val * -1),
          y: useTransform(mouseY, (val) => val * -1),
        }}
      />

      <motion.div style={{ y, scale }} className="z-10 relative text-center px-4">
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-[12rem] font-black leading-none tracking-tighter mix-blend-difference"
        >
          HAHA
          <br />
          HEHE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xl md:text-3xl font-bold uppercase tracking-widest bg-[#E0FF00] text-black inline-block px-4 py-2 -rotate-2"
        >
          The Anatomy of a Laugh
        </motion.p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 mix-blend-difference"
      >
        <ArrowDown className="w-12 h-12" />
      </motion.div>
    </motion.section>
  );
};

const Intro = () => {
  const text = "Humor is humanity's coping mechanism. A glitch in our pattern recognition. From ancient fart jokes to absurdist memes, it defines us.";
  const words = text.split(' ');

  return (
    <section className="relative py-32 px-4 bg-white text-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black mb-16 tracking-tighter uppercase">
          A Glitch in the <span className="line-through decoration-[#FF003C] decoration-8">Matrix</span> Mind
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-3xl md:text-5xl font-bold leading-tight">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.1, y: 50, rotateZ: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
              viewport={{ margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.02, ease: 'backOut' }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

// Horizontal scroll timeline
const milestones = [
  {
    year: '1900 BC',
    title: 'Sumerian Fart Jokes',
    desc: 'The oldest recorded joke is a Sumerian proverb about a woman farting in her husband\'s lap. Sophisticated.',
    color: 'bg-[#FF4D00]',
    textColor: 'text-white',
  },
  {
    year: '400 BC',
    title: 'Greek Irony',
    desc: 'Aristophanes introduces satire. Humor becomes a weapon against power. The "Cloudcuckooland" is born.',
    color: 'bg-[#0047FF]',
    textColor: 'text-white',
  },
  {
    year: '1590s',
    title: 'Shakespearean Wit',
    desc: 'Puns, insults, and high-brow wordplay. "Villain, I have done thy mother" - Titus Andronicus (essentially).',
    color: 'bg-[#E0FF00]',
    textColor: 'text-black',
  },
  {
    year: '1920s',
    title: 'Slapstick Era',
    desc: 'Physical comedy transcends language. Chaplin and Keaton turn pain into poetry.',
    color: 'bg-black',
    textColor: 'text-white',
  },
];

const Timeline = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-neutral-100">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex">
          {milestones.map((item, i) => (
            <div
              key={i}
              className={cn(
                'relative h-screen w-screen flex-shrink-0 flex flex-col justify-center p-8 md:p-24',
                item.color,
                item.textColor
              )}
            >
              <div className="max-w-2xl border-l-8 border-current pl-8">
                <span className="block text-9xl font-black opacity-50 mb-4 tracking-tighter">
                  {item.year}
                </span>
                <h3 className="text-6xl md:text-8xl font-black uppercase mb-8 leading-none">
                  {item.title}
                </h3>
                <p className="text-2xl md:text-4xl font-medium leading-snug">
                  {item.desc}
                </p>
              </div>
              <span className="absolute bottom-8 right-8 text-9xl font-black opacity-10">
                0{i + 1}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const SlapstickInteract = () => {
  const [count, setCount] = useState(0);
  const [isHit, setIsHit] = useState(false);

  const handleHit = () => {
    setCount((c) => c + 1);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 200);
  };

  return (
    <section className="py-32 bg-white text-black overflow-hidden relative">
      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block border-4 border-black p-4 mb-12"
        >
          <h3 className="text-xl font-bold uppercase tracking-widest">Interactive Interlude</h3>
        </motion.div>

        <h2 className="text-6xl md:text-8xl font-black mb-8 uppercase">
          Hit Me With Your<br />Best Shot
        </h2>
        <p className="text-2xl mb-12 max-w-lg mx-auto">
          Slapstick is about resilience. We laugh because they get back up. Try it.
        </p>

        <motion.button
          onClick={handleHit}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
          className="relative group"
        >
          <div className={cn(
            "w-64 h-64 bg-[#FF003C] rounded-full flex items-center justify-center border-8 border-black transition-transform duration-75",
            isHit ? "scale-90 rotate-12" : ""
          )}>
            {isHit ? <Frown size={100} className="text-white" /> : <Smile size={100} className="text-white" />}
          </div>
          <div className="absolute -top-4 -right-12 bg-black text-white px-4 py-2 rotate-12 font-black text-xl">
            CLICKS: {count}
          </div>
          <MousePointerClick className="absolute bottom-4 right-4 w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity animate-bounce" />
        </motion.button>
      </div>

      {/* Background chaos on click */}
      {isHit && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-[20rem] font-black text-black opacity-10 select-none">
            POW!
          </div>
        </motion.div>
      )}
    </section>
  );
};

const ModernChaos = () => {
  return (
    <section className="relative min-h-screen bg-[#0f0f0f] text-white py-32 overflow-hidden">
      <div className="relative z-10 px-4 mb-32">
        <ParallaxText baseVelocity={-5} className="text-9xl md:text-[15rem] font-black text-[#00ff00]">
          LOL LMAO ROFL LOL LMAO ROFL
        </ParallaxText>
        <ParallaxText baseVelocity={3} className="text-9xl md:text-[15rem] font-black text-transparent stroke-white stroke-[3px]" >
          DEAD ?? CRYING ?? SKSKSK
        </ParallaxText>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-[#0047FF] p-8 md:p-12 rotate-3 border-4 border-white mb-16"
            >
              <h3 className="text-5xl font-black mb-6 uppercase">Post-Irony & The Internet</h3>
              <p className="text-2xl font-bold">
                We have reached peak saturation. Humor is now randomly generated, deep-fried, and layered in 12 levels of irony.
              </p>
            </motion.div>
            <p className="text-3xl md:text-5xl font-black leading-tight">
              When everything is a joke, <span className="text-[#FF003C]">nothing is.</span>
            </p>
          </div>
          <div className="relative h-[600px] border-4 border-white bg-white/5 p-4 overflow-hidden">
             {/* Simulated chaotic meme feed */}
             <div className="absolute inset-0 flex flex-col gap-4 p-4 animate-slide-up opacity-50">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-neutral-800 p-4 border border-neutral-600 rounded-lg">
                    <div className="w-full h-32 bg-neutral-700 mb-2 animate-pulse" />
                    <div className="h-4 bg-neutral-700 w-3/4 rounded animate-pulse" />
                  </div>
                ))}
             </div>
             <div className="relative z-10 h-full flex items-center justify-center">
               <motion.div
                 animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 0.9, 1] }}
                 transition={{ repeat: Infinity, duration: 0.5 }}
                 className="text-9xl"
               >
                 ??
               </motion.div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="h-screen bg-[#E0FF00] text-black flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
      >
        <Skull size={120} className="mb-8 mx-auto" />
      </motion.div>
      <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-8">
        Don't Forget<br />To Smile
      </h2>
      <p className="text-xl font-bold uppercase tracking-widest border-t-4 border-black pt-8">
        End of transmission
      </p>
    </footer>
  );
};

// --- Custom Scroll Progress Bar ---
const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-3 bg-[#FF003C] origin-left z-50 mix-blend-difference"
      style={{ scaleX }}
    />
  );
};

export default function HumorHistoryLongread() {
  // Add some global styles for the slide animation in ModernChaos
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slide-up {
        from { transform: translateY(0); }
        to { transform: translateY(-50%); }
      }
      .animate-slide-up {
        animation: slide-up 20s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <main className="bg-neutral-950 min-h-screen font-sans antialiased selection:bg-[#E0FF00] selection:text-black">
      <NoiseOverlay />
      <ProgressBar />

      <Hero />
      <Intro />
      <Timeline />
      <SlapstickInteract />
      <ModernChaos />
      <Footer />
    </main>
  );
}
