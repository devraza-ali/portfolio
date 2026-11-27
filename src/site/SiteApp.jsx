import React, { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { FiBriefcase, FiCpu, FiFileText, FiGithub, FiHome, FiLayers, FiLinkedin, FiMail, FiMoon, FiPlay, FiSun, FiTerminal } from "react-icons/fi";
import resumeData from "../utils/resumeData";
import Dock from "../components/reactbits/Dock";
import TargetCursor from "../components/reactbits/TargetCursor";
import { FunLayer } from "../components/FunLayer";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { usePointerFine } from "../hooks/usePointerFine";
import { AchievementToasts, TrophyButton, unlock } from "./achievements";
import { Terminal, openTerminal } from "./Terminal";
import { Hero } from "./sections/Hero";
import { Marquee } from "./sections/Glance";
import { About } from "./sections/About";
import { Work } from "./sections/Work";
import { Expertise, Skills, Experience } from "./sections/Depth";
import { Activity } from "./sections/Activity";
import { Playground } from "./sections/Playground";
import { Contact, Footer } from "./sections/Contact";
import "./site.css";

const SECTIONS = ["top", "about", "work", "expertise", "skills", "experience", "github", "games", "contact"];

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
  const flips = React.useRef(0);

  // Five switches in one visit earns the "Light switch" achievement; the
  // terminal's theme command arrives as an event.
  useEffect(() => {
    if (++flips.current > 5) unlock("theme");
  }, [theme]);
  useEffect(() => {
    const on = (e) => setTheme(e.detail === "light" ? "light" : "dark");
    window.addEventListener("rm:theme", on);
    return () => window.removeEventListener("rm:theme", on);
  }, []);

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

/**
 * "Hire me" plays hard to get on a mouse: it hops away twice, then gives in.
 * Touch and keyboard users get a normal link. Once caught it stays put for the
 * rest of the visit.
 */
const HOPS = [
  { x: -70, y: 52 },
  { x: -240, y: 52 },
];
function HirePill() {
  const fine = usePointerFine();
  const [hops, setHops] = useState(() => {
    try {
      return sessionStorage.getItem("rm-hire-caught") ? 99 : 0;
    } catch {
      return 99;
    }
  });
  const [label, setLabel] = useState("Hire me");
  const at = hops > 0 && hops <= HOPS.length ? HOPS[hops - 1] : { x: 0, y: 0 };

  const dodge = () => {
    if (!fine || hops > HOPS.length) return;
    const n = hops + 1;
    setHops(n);
    if (n <= HOPS.length) {
      setLabel(n === 1 ? "Nope 😜" : "Too slow!");
      return;
    }
    setLabel("Okay okay, let's talk 😅");
    unlock("hire");
    try {
      sessionStorage.setItem("rm-hire-caught", "1");
    } catch {}
    setTimeout(() => setLabel("Hire me"), 2600);
  };

  return (
    <motion.a
      href="#contact"
      className="pill hire-pill cursor-target"
      data-cursor-label="say hi"
      onPointerEnter={dodge}
      animate={{ x: at.x, y: at.y }}
      transition={{ type: "spring", stiffness: 520, damping: 22 }}
    >
      {label}
    </motion.a>
  );
}

const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function SiteApp() {
  const reduced = usePrefersReducedMotion();
  const [loading, setLoading] = useState(!reduced);
  const active = useScrollSpy(SECTIONS, { offset: 200, syncHash: false });

  const [theme, toggleTheme] = useTheme(reduced);

  // "The whole story": reaching the footer.
  // Only after the preloader, and only from a real scroll (not a restored
  // position or a layout that's still settling).
  useEffect(() => {
    if (loading) return;
    const el = document.querySelector(".site footer");
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && window.scrollY > window.innerHeight * 3 && unlock("bottom"),
      { threshold: 0.6 }
    );
    const t = setTimeout(() => io.observe(el), 1500);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [loading]);

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
    { icon: <FiPlay size={20} />, label: "Games", onClick: go("games"), active: active === "games" },
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
          <a href="#top" className="logo cursor-target" data-cursor-label="home" aria-label="Back to top"><b>RM</b> <span className="logo-name">Raza Ali Malik</span></a>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <TrophyButton />
            <button type="button" className="theme-toggle term-btn cursor-target" data-cursor-label="terminal" aria-label="Open terminal" onClick={openTerminal}>
              <FiTerminal size={15} />
            </button>
            <span className="pill pill-time"><span className="live-dot" /> UK <UkTime /></span>
            <HirePill />
          </div>
        </header>

        <main>
          <Hero ready={!loading} />
          <Marquee />
          <About />
          <Work />
          <Expertise />
          <Skills />
          <Experience />
          <Activity />
          <Playground />
          <Contact />
        </main>
        <Footer />

        <Terminal />
        <AchievementToasts />

        <div className="dock-host">
          <Dock items={dockItems} baseItemSize={46} magnification={68} panelHeight={64} theme={theme} accentColor={theme === "dark" ? "#34d399" : "#059669"} />
        </div>
      </div>
    </FunLayer>
  );
}
