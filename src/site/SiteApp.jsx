import React, { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { FiBriefcase, FiCpu, FiFileText, FiGithub, FiHome, FiLayers, FiLinkedin, FiMail, FiMoon, FiSun } from "react-icons/fi";
import resumeData from "../utils/resumeData";
import Dock from "../components/reactbits/Dock";
import TargetCursor from "../components/reactbits/TargetCursor";
import { FunLayer } from "../components/FunLayer";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Hero } from "./sections/Hero";
import { Glance, Marquee } from "./sections/Glance";
import { Work } from "./sections/Work";
import { Expertise, Skills, Experience } from "./sections/Depth";
import { Activity } from "./sections/Activity";
import { Contact, Footer } from "./sections/Contact";
import "./site.css";

const SECTIONS = ["top", "about", "work", "expertise", "skills", "experience", "github", "contact"];

/** Counts 0 → 100 over a black curtain, then lifts it. Skipped for reduced motion. */
function Preloader({ onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const DURATION = 1300;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      setN(Math.round(100 * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      key="preloader"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
      style={{ position: "fixed", inset: 0, zIndex: 10000, background: "var(--bg0)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "28px 24px" }}
    >
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--dim)", fontSize: 11.5, letterSpacing: "0.16em" }}>
        <span>RAZA ALI MALIK</span>
        <span>PORTFOLIO · {new Date().getFullYear()}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <span className="mono" style={{ color: "var(--muted)", fontSize: 12.5 }}>Loading the good stuff…</span>
        <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 400, fontSize: "clamp(64px,12vw,160px)", lineHeight: 0.8, letterSpacing: "-0.05em", color: "var(--ink)" }}>
          {n}
          <span style={{ color: "var(--accent)" }}>%</span>
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 2, width: `${n}%`, background: "var(--accent)" }} />
    </motion.div>
  );
}

/** Writes the pointer position into CSS vars for the grid-and-glow layer. */
function CursorGlow() {
  const ref = React.useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let idle;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
        el.removeAttribute("data-idle");
      });
      clearTimeout(idle);
      idle = setTimeout(() => el.setAttribute("data-idle", ""), 2600);
    };
    const leave = () => el.setAttribute("data-idle", "");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div ref={ref} className="cursor-glow" data-idle="" aria-hidden="true" />;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ position: "fixed", top: 0, left: 0, right: 0, height: 1, zIndex: 70, transformOrigin: "0 50%", scaleX, background: "var(--accent)" }}
    />
  );
}

function UkTime() {
  const fmt = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const THEME_KEY = "portfolio-theme";

function initialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
  html.classList.toggle("light", theme === "light");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#070a09" : "#f4f5f1");
}

/**
 * Theme state plus a toggle that, where the browser supports View Transitions,
 * reveals the new theme as a circle growing out of the button that was pressed.
 */
function useTheme(reduced) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const toggle = useCallback(
    (e) => {
      const next = theme === "dark" ? "light" : "dark";
      if (!document.startViewTransition || reduced) {
        setTheme(next);
        return;
      }
      const x = e?.clientX ?? window.innerWidth - 40;
      const y = e?.clientY ?? 40;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const vt = document.startViewTransition(() => {
        flushSync(() => setTheme(next));
        applyTheme(next);
      });
      vt.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      });
    },
    [theme, reduced]
  );

  return [theme, toggle];
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle cursor-target"
      data-cursor-label={theme === "dark" ? "lights on" : "lights off"}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={onToggle}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "grid" }}
        >
          {theme === "dark" ? <FiSun size={15} /> : <FiMoon size={15} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function SiteApp() {
  const reduced = usePrefersReducedMotion();
  const [loading, setLoading] = useState(!reduced);
  const active = useScrollSpy(SECTIONS, { offset: 200, syncHash: false });

  const [theme, toggleTheme] = useTheme(reduced);

  // Keep the page from scrolling under the curtain.
  useEffect(() => {
    document.documentElement.style.overflow = loading ? "hidden" : "";
  }, [loading]);

  const dockItems = [
    { icon: <FiHome size={20} />, label: "Home", onClick: go("top"), active: active === "top" },
    { icon: <FiLayers size={20} />, label: "Work", onClick: go("work"), active: active === "work" },
    { icon: <FiCpu size={20} />, label: "Expertise", onClick: go("expertise"), active: active === "expertise" || active === "skills" },
    { icon: <FiBriefcase size={20} />, label: "Experience", onClick: go("experience"), active: active === "experience" },
    { icon: <FiGithub size={20} />, label: "Activity", onClick: go("github"), active: active === "github" },
    { icon: <FiMail size={20} />, label: "Contact", onClick: go("contact"), active: active === "contact" },
    { separator: true },
    { icon: <FiLinkedin size={20} />, label: "LinkedIn", onClick: () => window.open(resumeData.linkedinUrl, "_blank", "noopener") },
    { icon: <FiFileText size={20} />, label: "Résumé", onClick: () => window.open(resumeData.resumeDownloads[0].file, "_blank", "noopener") },
  ];

  return (
    <FunLayer>
      <div className="site">
        <AnimatePresence>{loading && <Preloader onDone={() => setLoading(false)} />}</AnimatePresence>
        <ScrollProgress />
        <div className="site-grain" aria-hidden="true" />
        {!reduced && <CursorGlow />}
        {!reduced && <TargetCursor spinDuration={2.4} hideDefaultCursor parallaxOn cursorColor="#ffffff" blendMode="difference" />}

        <header className="topbar">
          <a href="#top" className="logo cursor-target" data-cursor-label="home" aria-label="Back to top"><b>RM</b> Raza Ali Malik</a>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <span className="pill pill-time"><span className="live-dot" /> UK <UkTime /></span>
            <a href="#contact" className="pill cursor-target" data-cursor-label="say hi" style={{ color: "var(--ink)", textDecoration: "none" }}>Hire me</a>
          </div>
        </header>

        <main>
          <Hero ready={!loading} />
          <Marquee />
          <Glance />
          <Work />
          <Expertise />
          <Skills />
          <Experience />
          <Activity />
          <Contact />
        </main>
        <Footer />

        <div className="dock-host">
          <Dock items={dockItems} baseItemSize={46} magnification={68} panelHeight={64} theme={theme} accentColor={theme === "dark" ? "#34d399" : "#059669"} />
        </div>
      </div>
    </FunLayer>
  );
}
