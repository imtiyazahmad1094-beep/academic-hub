import React, { useEffect, useRef, useMemo } from 'react';

interface HeroProximityHeadlineProps {
  className?: string;
  radius?: number;
  maxDisplacement?: number;
  maxBlur?: number;
}

interface TokenState {
  element: HTMLElement | null;
  phase: 'idle' | 'tracking' | 'returning' | 'clearing';
  timer1: ReturnType<typeof setTimeout> | null;
  timer2: ReturnType<typeof setTimeout> | null;
  lastBlur: number;
  lastOpacity: number;
}

interface CharDef {
  id: number;
  char: string;
  accent?: boolean;
}

interface WordDef {
  id: string;
  chars: CharDef[];
  accent?: boolean;
}

export const HeroProximityHeadline: React.FC<HeroProximityHeadlineProps> = ({
  className = '',
  radius = 120,
  maxDisplacement = 45,
  maxBlur = 6
}) => {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const tokenStatesRef = useRef<Map<number, TokenState>>(new Map());

  // Target Headline: "Share and Find Great Academic Events Easily"
  // Structured into words and characters with preserved word boundaries
  const words: WordDef[] = useMemo(() => {
    let charCounter = 0;
    const rawWords = [
      { text: 'Share', accent: false },
      { text: 'and', accent: false },
      { text: 'Find', accent: false },
      { text: 'Great', accent: true },
      { text: 'Academic', accent: true },
      { text: 'Events', accent: true },
      { text: 'Easily', accent: false }
    ];

    return rawWords.map((w, wIdx) => ({
      id: `w-${wIdx}-${w.text}`,
      accent: w.accent,
      chars: Array.from(w.text).map((char) => ({
        id: charCounter++,
        char,
        accent: w.accent
      }))
    }));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number | null = null;
    let mouseX = -9999;
    let mouseY = -9999;

    const handlePointerMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateTokens);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updateTokens);
        }
      }
    };

    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateTokens);
      }
    };

    const updateTokens = () => {
      animationFrameId = null;
      const states = tokenStatesRef.current;

      states.forEach((state) => {
        if (!state.element) return;
        const el = state.element;

        const rect = el.getBoundingClientRect();
        // Skip unrendered or zero-size tokens
        if (rect.width === 0 && rect.height === 0) return;

        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const dx = charCenterX - mouseX;
        const dy = charCenterY - mouseY;
        const distance = Math.hypot(dx, dy);

        // =========================================================
        // PROXIMITY ZONE: Within interaction boundary radius (120px)
        // =========================================================
        if (distance < radius) {
          // INTERRUPTIBLE STATE TRACKING:
          // Immediately cancel any active recovery phases (Phase 1 or Phase 2)
          if (state.timer1) {
            clearTimeout(state.timer1);
            state.timer1 = null;
          }
          if (state.timer2) {
            clearTimeout(state.timer2);
            state.timer2 = null;
          }

          // Strip transition lag to guarantee immediate 60fps frame rate
          el.style.transition = 'none';

          const proximity = 1 - distance / radius; // 0 to 1
          const angle = Math.atan2(dy, dx);
          const pushDistance = proximity * maxDisplacement;

          const displaceX = Math.cos(angle) * pushDistance;
          const displaceY = Math.sin(angle) * pushDistance;

          // Higher proximity: maximum displacement, lower opacity, and blur up to 6px
          const blurPx = proximity * maxBlur;
          const opacity = Math.max(0.25, 1 - proximity * 0.75);

          state.lastBlur = blurPx;
          state.lastOpacity = opacity;
          state.phase = 'tracking';

          el.style.transform = `translate3d(${displaceX.toFixed(2)}px, ${displaceY.toFixed(2)}px, 0)`;
          el.style.filter = `blur(${blurPx.toFixed(2)}px)`;
          el.style.opacity = opacity.toFixed(2);
        } else {
          // =======================================================
          // EXIT ZONE: Outside interaction boundary radius
          // =======================================================
          if (state.phase === 'tracking') {
            // PHASE 1: Return-to-Home Velocity
            // Immediately snap back from displaced vector to original baseline position (0, 0, 0)
            // STRICT REQUIREMENT: Retain active blurred state overlay while traveling back
            state.phase = 'returning';

            el.style.transition = 'transform 180ms cubic-bezier(0.16, 0.9, 0.3, 1.25)';
            el.style.transform = 'translate3d(0, 0, 0)';
            el.style.filter = `blur(${state.lastBlur.toFixed(2)}px)`;
            el.style.opacity = state.lastOpacity.toFixed(2);

            // PHASE 2: Blur-to-Clean Decay
            // Only after settling completely back at home base position, decay blur and restore opacity
            state.timer1 = setTimeout(() => {
              state.phase = 'clearing';

              // Smooth decay transition to pristine sharpness
              el.style.transition = 'filter 320ms ease-out, opacity 320ms ease-out';
              el.style.filter = 'blur(0px)';
              el.style.opacity = '1';

              state.timer2 = setTimeout(() => {
                state.phase = 'idle';
                el.style.transition = '';
                el.style.filter = '';
                el.style.opacity = '';
                el.style.transform = '';
              }, 330);
            }, 180);
          }
        }
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    window.addEventListener('touchend', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchend', handlePointerLeave);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Cleanup all active recovery timers
      tokenStatesRef.current.forEach((state) => {
        if (state.timer1) clearTimeout(state.timer1);
        if (state.timer2) clearTimeout(state.timer2);
      });
    };
  }, [radius, maxDisplacement, maxBlur]);

  return (
    <h1
      ref={containerRef}
      data-i18n="mainHeadline"
      className={`select-none text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-tight max-w-4xl mx-auto text-slate-900 dark:text-white ${className}`}
      style={{ userSelect: 'none' }}
    >
      {words.map((word, wIdx) => {
        const isAccentGroup = word.accent;

        return (
          <React.Fragment key={word.id}>
            {/* Word container preventing accidental hyphenation or line collapse mid-word */}
            <span
              className={`inline-block whitespace-nowrap relative ${
                isAccentGroup
                  ? 'text-sky-600 dark:text-sky-300 font-serif'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {/* If this is the start of "Great Academic Events", render background pastel & crayon decoration */}
              {word.chars[0]?.char === 'G' && wIdx === 3 && (
                <>
                  {/* Translucent hand-drawn pastel highlight wash block unfurling */}
                  <span 
                    className="absolute inset-x-[-8px] inset-y-[-2px] bg-amber-300/40 dark:bg-amber-400/25 -z-10 rounded-xl transform -rotate-1 pointer-events-none" 
                    aria-hidden="true"
                  />
                  {/* Live sketching crayon marker underline SVG path-draw */}
                  <svg 
                    className="absolute -bottom-3 left-0 w-[105%] sm:w-[108%] h-5 text-amber-500 dark:text-amber-400 pointer-events-none overflow-visible z-20" 
                    viewBox="0 0 240 24" 
                    fill="none"
                    aria-hidden="true"
                  >
                    <path 
                      d="M4 16 C 50 4, 130 22, 236 10 M10 18 C 70 8, 160 20, 228 12" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="animate-crayon-draw" 
                    />
                  </svg>
                </>
              )}

              {/* Isolated, single-character inline-block 'span' element tokens */}
              {word.chars.map((token) => (
                <span
                  key={`token-${token.id}`}
                  ref={(node) => {
                    if (node) {
                      tokenStatesRef.current.set(token.id, {
                        element: node,
                        phase: 'idle',
                        timer1: null,
                        timer2: null,
                        lastBlur: 0,
                        lastOpacity: 1
                      });
                    } else {
                      tokenStatesRef.current.delete(token.id);
                    }
                  }}
                  className="inline-block relative cursor-default transition-none"
                  style={{
                    willChange: 'transform, filter, opacity',
                    transform: 'translate3d(0, 0, 0)'
                  }}
                >
                  {token.char}
                </span>
              ))}
            </span>

            {/* Preserve standard layout space gap characters using explicit blank helper nodes */}
            {wIdx < words.length - 1 && (
              <span
                key={`space-${word.id}`}
                className="inline-block select-none"
                aria-hidden="true"
                style={{ width: '0.34em' }}
              >
                &nbsp;
              </span>
            )}
          </React.Fragment>
        );
      })}
    </h1>
  );
};
