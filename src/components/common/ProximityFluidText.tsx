import React, { useEffect, useRef, useMemo } from 'react';

interface ProximityFluidTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  radius?: number;
  maxDisplacement?: number;
  maxBlur?: number;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

interface TokenState {
  element: HTMLElement | null;
  phase: 'idle' | 'tracking' | 'returning' | 'clearing';
  timer1: ReturnType<typeof setTimeout> | null;
  timer2: ReturnType<typeof setTimeout> | null;
  lastBlur: number;
  lastOpacity: number;
}

export const ProximityFluidText: React.FC<ProximityFluidTextProps> = ({
  text,
  className = '',
  charClassName = '',
  radius = 95,
  maxDisplacement = 38,
  maxBlur = 7.5,
  as = 'span'
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const tokenStatesRef = useRef<Map<number, TokenState>>(new Map());

  // Split text into tokens while preserving non-breaking spaces
  const tokens = useMemo(() => {
    return Array.from(text).map((char, index) => ({
      id: index,
      char,
      isSpace: char === ' '
    }));
  }, [text]);

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

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateTokens);
      }
    };

    const updateTokens = () => {
      animationFrameId = null;
      const states = tokenStatesRef.current;

      tokens.forEach((token) => {
        const state = states.get(token.id);
        if (!state || !state.element) return;
        const el = state.element;

        if (token.isSpace) return;

        const rect = el.getBoundingClientRect();
        // Skip hidden or unrendered tokens
        if (rect.width === 0 && rect.height === 0) return;

        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const dx = charCenterX - mouseX;
        const dy = charCenterY - mouseY;
        const distance = Math.hypot(dx, dy);

        // Within proximity radius: Scatter and degrade
        if (distance < radius) {
          // Interruptible state tracking: cancel any active recovery phases
          if (state.timer1) {
            clearTimeout(state.timer1);
            state.timer1 = null;
          }
          if (state.timer2) {
            clearTimeout(state.timer2);
            state.timer2 = null;
          }
          el.classList.remove('returning-home', 'clearing-blur');

          // Instant tracking with no transition lag for 60fps responsiveness
          el.style.transition = 'none';

          const proximity = 1 - distance / radius; // 0 to 1
          const angle = Math.atan2(dy, dx);
          const pushDistance = proximity * maxDisplacement;

          const displaceX = Math.cos(angle) * pushDistance;
          const displaceY = Math.sin(angle) * pushDistance;

          const blurPx = Math.min(maxBlur, Math.max(0, proximity * maxBlur));
          const opacity = Math.max(0.18, 1 - proximity * 0.82);

          state.lastBlur = blurPx;
          state.lastOpacity = opacity;
          state.phase = 'tracking';

          el.style.transform = `translate3d(${displaceX.toFixed(2)}px, ${displaceY.toFixed(2)}px, 0)`;
          el.style.filter = `blur(${blurPx.toFixed(2)}px)`;
          el.style.opacity = opacity.toFixed(2);
        } else {
          // Cursor is outside radius. Check if token needs to enter recovery phase
          if (state.phase === 'tracking') {
            // PHASE 1: Return-to-Home Velocity
            // Snap back to original layout position while strictly retaining blurred state overlay
            state.phase = 'returning';
            el.classList.add('returning-home');
            el.classList.remove('clearing-blur');

            // Quick transition back to baseline (180ms)
            el.style.transition = 'transform 180ms cubic-bezier(0.16, 0.9, 0.3, 1.25)';
            el.style.transform = 'translate3d(0, 0, 0)';

            // STRICT REQUIREMENT: Retain the active blur and low opacity during home travel
            el.style.filter = `blur(${state.lastBlur.toFixed(2)}px)`;
            el.style.opacity = state.lastOpacity.toFixed(2);

            // PHASE 2: Blur-to-Clean Decay
            // Only after landing back at home base, clear away blur and restore opacity
            state.timer1 = setTimeout(() => {
              state.phase = 'clearing';
              el.classList.remove('returning-home');
              el.classList.add('clearing-blur');

              // Smooth decay animation for filter and opacity
              el.style.transition = 'filter 320ms ease-out, opacity 320ms ease-out';
              el.style.filter = 'blur(0px)';
              el.style.opacity = '1';

              state.timer2 = setTimeout(() => {
                state.phase = 'idle';
                el.classList.remove('clearing-blur');
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
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      // Clean up any remaining timers
      tokenStatesRef.current.forEach((state) => {
        if (state.timer1) clearTimeout(state.timer1);
        if (state.timer2) clearTimeout(state.timer2);
      });
    };
  }, [tokens, radius, maxDisplacement, maxBlur]);

  const Tag = as;

  return (
    <Tag
      ref={containerRef as any}
      className={`inline-block relative select-none ${className}`}
      style={{ userSelect: 'none' }}
    >
      {tokens.map((token) => {
        if (token.isSpace) {
          return (
            <span
              key={`space-${token.id}`}
              className="inline-block"
              style={{ width: '0.32em' }}
            >
              &nbsp;
            </span>
          );
        }

        return (
          <span
            key={`char-${token.id}`}
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
            className={`inline-block relative cursor-default ${charClassName}`}
            style={{
              willChange: 'transform, filter, opacity',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            {token.char}
          </span>
        );
      })}
    </Tag>
  );
};
