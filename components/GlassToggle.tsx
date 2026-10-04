import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type PanInfo
} from 'framer-motion';

// ============================================================================
// TYPES & PROPS
// ============================================================================

export type GlassToggleSize = 'sm' | 'md' | 'lg';

export interface GlassToggleProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Uncontrolled default state */
  defaultChecked?: boolean;
  /** Callback fired when state toggles */
  onCheckedChange?: (checked: boolean) => void;
  /** Label text when unchecked (defaults to "Confirm") */
  labelOff?: string;
  /** Label text when checked (defaults to "Confirmed") */
  labelOn?: string;
  /** Component size scale */
  size?: GlassToggleSize;
  /** Disabled state */
  disabled?: boolean;
  /** Custom extra classes */
  className?: string;
}

// Size metrics for consistent 3:1 aspect ratio and thumb clearance
const SIZE_CONFIG: Record<
  GlassToggleSize,
  {
    width: number;
    height: number;
    pillRadius: number;
    fontSize: string;
    thumbWidth: number;
    thumbHeight: number;
    thumbOffsetMax: number;
    thumbPadding: number;
  }
> = {
  sm: {
    width: 180,
    height: 60,
    pillRadius: 30,
    fontSize: 'text-xl',
    thumbWidth: 44,
    thumbHeight: 44,
    thumbOffsetMax: 124,
    thumbPadding: 6,
  },
  md: {
    width: 240,
    height: 80,
    pillRadius: 40,
    fontSize: 'text-3xl',
    thumbWidth: 56,
    thumbHeight: 56,
    thumbOffsetMax: 168,
    thumbPadding: 8,
  },
  lg: {
    width: 300,
    height: 100,
    pillRadius: 50,
    fontSize: 'text-4xl',
    thumbWidth: 70,
    thumbHeight: 70,
    thumbOffsetMax: 212,
    thumbPadding: 10,
  },
};

// ============================================================================
// MAIN COMPONENT: GlassToggle
// ============================================================================

export const GlassToggle: React.FC<GlassToggleProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  labelOff = 'Confirm',
  labelOn = 'Confirmed',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  // Unique filter ID so multiple toggles on the same page don't collide
  const id = useId().replace(/:/g, '-');
  const prefersReduced = useReducedMotion();

  // Internal state handling (controlled vs uncontrolled)
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const config = SIZE_CONFIG[size];
  const containerRef = useRef<HTMLButtonElement>(null);

  // Mouse & orientation-based specular highlight tracking (--mx, --my)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Spring physics motion value for the sliding crystal thumb
  const targetX = isChecked ? config.thumbOffsetMax : 0;
  const thumbX = useMotionValue(targetX);

  const springConfig = prefersReduced
    ? { stiffness: 1000, damping: 100 }
    : { stiffness: 300, damping: 22, mass: 0.8 };

  const smoothX = useSpring(thumbX, springConfig);

  // Synchronize thumb position whenever checked state changes
  useEffect(() => {
    thumbX.set(isChecked ? config.thumbOffsetMax : 0);
  }, [isChecked, config.thumbOffsetMax, thumbX]);

  // Parallax subtle shifts on refraction highlights based on thumb travel
  const highlightShift = useTransform(smoothX, [0, config.thumbOffsetMax], [-8, 8]);
  const glassTintHue = useTransform(
    smoothX,
    [0, config.thumbOffsetMax],
    ['rgba(255, 255, 255, 0.05)', 'rgba(56, 189, 248, 0.14)']
  );

  // Toggle handler
  const handleToggle = useCallback(() => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  }, [disabled, isChecked, isControlled, onCheckedChange]);

  // Pointer move: Calculate specular reflection coordinates
  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!containerRef.current || disabled) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
  };

  // Keyboard accessibility (Space / Enter to toggle)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Drag handling for thumb pointer events
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;
    const halfway = config.thumbOffsetMax / 2;
    const projected = smoothX.get() + info.velocity.x * 0.15;
    const nextState = projected > halfway;
    if (nextState !== isChecked) {
      if (!isControlled) setInternalChecked(nextState);
      onCheckedChange?.(nextState);
    } else {
      thumbX.set(isChecked ? config.thumbOffsetMax : 0);
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={
        {
          '--glass-blur': '3.5px',
          '--glass-refraction': '18px',
          '--glass-tint': isChecked ? 'rgba(56, 189, 248, 0.14)' : 'rgba(255, 255, 255, 0.05)',
          '--glass-rim': 'rgba(255, 255, 255, 0.95)',
          '--mx': `${(mousePos.x * 100).toFixed(1)}%`,
          '--my': `${(mousePos.y * 100).toFixed(1)}%`,
        } as React.CSSProperties
      }
    >
      {/* ====================================================================
          SVG REFRACTION, CHROMATIC ABERRATION & SPECULAR FILTERS
          ==================================================================== */}
      <svg
        className="absolute w-0 h-0 pointer-events-none opacity-0 overflow-hidden"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Main Body Refraction Filter with Chromatic Prism Dispersion */}
          <filter
            id={`${id}-refraction`}
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
            colorInterpolationFilters="sRGB"
          >
            {/* 1. Organic glass mold normals and diagonal caustic wave ridges */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.04"
              numOctaves="3"
              seed="42"
              result="noiseBase"
            />
            {/* Shape noise into discrete glass facet ridges */}
            <feComponentTransfer in="noiseBase" result="ridgeNormals">
              <feFuncR type="linear" slope="2.4" intercept="-0.65" />
              <feFuncG type="linear" slope="2.4" intercept="-0.65" />
              <feFuncB type="linear" slope="2.4" intercept="-0.65" />
            </feComponentTransfer>

            {/* 2. Chromatic aberration: Separate R, G, B channels with different displacement factors */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="ridgeNormals"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="redOnly"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="ridgeNormals"
              scale="17"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="greenOnly"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="ridgeNormals"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispBlue"
            />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blueOnly"
            />

            {/* 3. Recombine R, G, B channels via screen blending to produce chromatic fringes */}
            <feBlend mode="screen" in="redOnly" in2="greenOnly" result="blendRG" />
            <feBlend mode="screen" in="blendRG" in2="blueOnly" result="chromaImage" />
          </filter>

          {/* Crystal Arrow Thumb Refraction Filter */}
          <filter
            id={`${id}-thumb-refraction`}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.04 0.08"
              numOctaves="2"
              seed="89"
              result="thumbNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="thumbNoise"
              scale="16"
              xChannelSelector="R"
              yChannelSelector="G"
              result="thumbDisplaced"
            />
          </filter>

          {/* Specular Edge Lighting for Bevel Highlights */}
          <filter id={`${id}-specular-light`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="4.5"
              specularConstant="1.4"
              specularExponent="28"
              lightingColor="#ffffff"
              result="specularLight"
            >
              <feDistantLight azimuth="135" elevation="58" />
            </feSpecularLighting>
            <feComposite in="specularLight" in2="SourceAlpha" operator="in" result="specularCut" />
          </filter>
        </defs>
      </svg>

      {/* ====================================================================
          ACCESSIBLE SWITCH BUTTON WRAPPER
          ==================================================================== */}
      <motion.button
        ref={containerRef}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={isChecked ? labelOn : labelOff}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        animate={{
          scale: prefersReduced ? 1 : isPressed ? 0.96 : isHovered ? 1.025 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 26,
        }}
        className={`relative block p-0 m-0 border-0 bg-transparent cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/40 rounded-full transition-opacity ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          width: config.width,
          height: config.height,
        }}
      >
        {/* Soft, low-contrast ambient diffuse shadow under the thick glass slab */}
        <div
          className="absolute -inset-1.5 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(148, 163, 184, 0.28) 0%, rgba(148, 163, 184, 0.12) 55%, transparent 75%)',
            filter: 'blur(9px)',
            opacity: isHovered ? 0.85 : 0.65,
          }}
        />

        {/* Outer ambient drop shadow with subtle lavender tone */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow:
              '0 12px 32px -4px rgba(100, 116, 139, 0.22), 0 4px 12px rgba(148, 163, 184, 0.18)',
          }}
        />

        {/* ==================================================================
            LAYER 1: TEXT LABEL BEHIND THE GLASS
            Placed directly in the background layer so the refractive glass slab
            bends, steps, and splits the letters along its beveled ridges!
            ================================================================== */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden rounded-full"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", sans-serif',
          }}
        >
          {/* Unchecked Label ("Confirm") */}
          <motion.div
            initial={false}
            animate={{
              opacity: isChecked ? 0 : 1,
              y: isChecked ? -12 : 0,
              scale: isChecked ? 0.94 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 24,
            }}
            className={`font-extrabold tracking-tight text-slate-900 ${config.fontSize}`}
            style={{
              textShadow:
                '0 1px 2px rgba(255, 255, 255, 0.8), 0 -1px 1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {labelOff}
          </motion.div>

          {/* Checked Label ("Confirmed") */}
          <motion.div
            initial={false}
            animate={{
              opacity: isChecked ? 1 : 0,
              y: isChecked ? 0 : 12,
              scale: isChecked ? 1 : 0.94,
            }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 24,
            }}
            className={`absolute font-extrabold tracking-tight text-slate-900 ${config.fontSize}`}
            style={{
              textShadow:
                '0 1px 2px rgba(255, 255, 255, 0.8), 0 -1px 1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {labelOn}
          </motion.div>
        </div>

        {/* ==================================================================
            LAYER 2: THICK REFRACTIVE GLASS SLAB (PILL BODY)
            Features real SVG displacement, chromatic fringes, beveled rim,
            and diagonal sweeping ridges molded across the glass surface.
            ================================================================== */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-10"
          style={{
            // Primary refraction through SVG filter
            backdropFilter: `url(#${id}-refraction) blur(var(--glass-blur, 3.5px)) saturate(1.7) brightness(1.06)`,
            WebkitBackdropFilter: `blur(var(--glass-blur, 3.5px)) saturate(1.7) brightness(1.06)`,
            backgroundColor: glassTintHue,
            // 3D Specular Rim & Inner Glow Stack
            boxShadow: `
              inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95),
              inset 0 -1.5px 2px 0 rgba(255, 255, 255, 0.7),
              inset 1.5px 0 2px 0 rgba(255, 255, 255, 0.8),
              inset -1.5px 0 2px 0 rgba(255, 255, 255, 0.6),
              inset 0 0 16px 2px rgba(255, 255, 255, 0.22),
              0 0 0 1px rgba(255, 255, 255, 0.65)
            `,
          }}
        >
          {/* Diagonal Glass Ridge Facets (Molded glass bevels cutting across 'Confirm') */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 240 80"
            preserveAspectRatio="none"
          >
            {/* Top-left to bottom-right sweeping curved facet line 1 */}
            <path
              d="M 52 0 Q 94 38 126 80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="2.2"
              style={{ filter: 'drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.9))' }}
            />
            {/* Prismatic chromatic shadow line 1 (Cyan/Pink fringe) */}
            <path
              d="M 50.5 0 Q 92.5 38 124.5 80"
              fill="none"
              stroke="rgba(0, 240, 255, 0.35)"
              strokeWidth="1.8"
            />
            <path
              d="M 53.5 0 Q 95.5 38 127.5 80"
              fill="none"
              stroke="rgba(255, 90, 190, 0.35)"
              strokeWidth="1.8"
            />

            {/* Diagonal facet line 2 (Cuts right above 'firm') */}
            <path
              d="M 136 0 Q 168 32 195 80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="1.8"
            />
            <path
              d="M 134.5 0 Q 166.5 32 193.5 80"
              fill="none"
              stroke="rgba(255, 230, 90, 0.3)"
              strokeWidth="1.4"
            />
            <path
              d="M 137.5 0 Q 169.5 32 196.5 80"
              fill="none"
              stroke="rgba(180, 100, 255, 0.35)"
              strokeWidth="1.4"
            />

            {/* Sweeping horizontal glass wave ridge across the top third */}
            <path
              d="M 10 22 C 70 8, 170 30, 230 14"
              fill="none"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="1.4"
              opacity="0.75"
            />
          </svg>

          {/* Dynamic Cursor-Following Specular Sheen (Reacts to mouse movement) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 90px at var(--mx) var(--my), rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.15) 45%, transparent 70%)`,
              mixBlendMode: 'overlay',
              opacity: isHovered ? 1 : 0.6,
            }}
          />

          {/* Iridescent Rainbow Edge Caustic Overlay (Top-left & Bottom-right prisms) */}
          <div
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255, 120, 200, 0.18) 0%, 
                  rgba(120, 230, 255, 0.22) 18%, 
                  rgba(255, 255, 255, 0.08) 40%, 
                  rgba(255, 240, 140, 0.15) 75%, 
                  rgba(180, 120, 255, 0.22) 100%
                )
              `,
              mixBlendMode: 'screen',
            }}
          />

          {/* Thin crisp inner hairline highlight along perimeter */}
          <div
            className="absolute inset-[1px] rounded-full pointer-events-none"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.55)',
            }}
          />
        </motion.div>

        {/* ==================================================================
            LAYER 3: CRYSTAL GLASS CURSOR-ARROW THUMB
            A beveled triangular arrow made of the same refractive liquid glass
            overlapping the pill. Drag-enabled with spring snap & velocity inertia.
            ================================================================== */}
        <motion.div
          drag={!disabled ? 'x' : false}
          dragConstraints={{ left: 0, right: config.thumbOffsetMax }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{
            x: smoothX,
            width: config.thumbWidth,
            height: config.thumbHeight,
            top: (config.height - config.thumbHeight) / 2,
            left: config.thumbPadding,
          }}
          className="absolute z-20 cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          {/* The Crystal Arrow Molded Body */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient shadow cast by the crystal arrow thumb */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                filter: 'drop-shadow(0 6px 14px rgba(100, 116, 139, 0.35))',
              }}
            >
              {/* Arrow SVG Silhouette */}
              <svg
                viewBox="0 0 56 56"
                className="w-full h-full overflow-visible"
                style={{
                  transform: 'rotate(-42deg) translate(2px, 2px)',
                }}
              >
                {/* Outer Glass Arrow Path */}
                <path
                  d="M 12 6 
                     C 14 3, 18 3, 20 6 
                     L 46 38 
                     C 48 41, 46 45, 43 45 
                     L 29 41 
                     L 18 52 
                     C 16 54, 12 53, 12 50 
                     Z"
                  fill="rgba(255, 255, 255, 0.28)"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{
                    backdropFilter: `url(#${id}-thumb-refraction) blur(3px) saturate(1.8)`,
                    WebkitBackdropFilter: 'blur(3px) saturate(1.8)',
                  }}
                />

                {/* Prismatic Inner Bevel Reflection on Arrow Head */}
                <path
                  d="M 15 10 L 40 37 L 30 39 L 20 48 Z"
                  fill="url(#arrow-rainbow)"
                  opacity="0.65"
                  style={{ mixBlendMode: 'screen' }}
                />

                {/* Bright Specular Spine Ridge */}
                <line
                  x1="16"
                  y1="8"
                  x2="29"
                  y2="40"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                {/* Rainbow Gradient Definition for Arrow Thumb */}
                <defs>
                  <linearGradient id="arrow-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 140, 210, 0.55)" />
                    <stop offset="35%" stopColor="rgba(120, 240, 255, 0.6)" />
                    <stop offset="70%" stopColor="rgba(255, 255, 255, 0.3)" />
                    <stop offset="100%" stopColor="rgba(255, 230, 120, 0.55)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
};

// ============================================================================
// DEMO SHOWCASE SECTION
// Renders the component on a pale lavender/white gradient background with
// interactive controls for testing sizes, controlled state, and CSS variables.
// ============================================================================

export const GlassToggleDemo: React.FC = () => {
  const [demoChecked, setDemoChecked] = useState(false);
  const [size, setSize] = useState<GlassToggleSize>('md');
  const [blurVal, setBlurVal] = useState(3.5);
  const [refractScale, setRefractScale] = useState(18);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-8 transition-colors duration-700"
      style={{
        background: `
          radial-gradient(circle at 50% 25%, #ffffff 0%, #f4f3fb 50%, #e9e6f7 100%)
        `,
      }}
    >
      {/* Background Decorative Mesh Shapes to Showcase Real Refraction */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(192, 132, 252, 0.35) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-xl text-center space-y-10">
        <header className="space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-purple-700 uppercase bg-purple-100/80 rounded-full backdrop-blur-sm border border-purple-200/60 shadow-sm">
            Apple-Grade Liquid Glass
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Liquid Glass Toggle
          </h1>
          <p className="text-base text-slate-600 max-w-md mx-auto">
            Physical optics with SVG refraction, chromatic aberration dispersion, and spring physics.
          </p>
        </header>

        {/* HERO COMPONENT DEMO */}
        <div className="py-6 flex flex-col items-center">
          <GlassToggle
            checked={demoChecked}
            onCheckedChange={setDemoChecked}
            size={size}
            labelOff="Confirm"
            labelOn="Confirmed"
            className="filter drop-shadow-xl"
          />

          <span className="mt-4 text-xs font-medium text-slate-500 tracking-wide">
            Status:{' '}
            <strong className={demoChecked ? 'text-cyan-600' : 'text-slate-700'}>
              {demoChecked ? 'ON (Confirmed)' : 'OFF (Confirm)'}
            </strong>{' '}
            &bull; Drag thumb or click to toggle
          </span>
        </div>

        {/* INTERACTIVE CONTROLS CARD */}
        <div className="w-full bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-xl space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <span className="text-sm font-semibold text-slate-800">Size Options</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              {(['sm', 'md', 'lg'] as GlassToggleSize[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-all ${
                    size === s
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Glass Blur</span>
                <span>{blurVal}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={blurVal}
                onChange={(e) => setBlurVal(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Refraction Scale</span>
                <span>{refractScale}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="36"
                step="1"
                value={refractScale}
                onChange={(e) => setRefractScale(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassToggle;
