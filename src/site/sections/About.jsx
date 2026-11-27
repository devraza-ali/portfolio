import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { FiArrowUpRight, FiClock, FiCreditCard, FiLayers, FiRefreshCw, FiUsers } from "react-icons/fi";
import resumeData from "../../utils/resumeData";
import SpotlightCard from "../../components/reactbits/SpotlightCard";
import CountUp from "../../components/reactbits/CountUp";
import DecryptedText from "../../components/reactbits/DecryptedText";
import { Reveal, SectionHead } from "../parts";
import { useSpot } from "./Glance";
import { usePointerFine } from "../../hooks/usePointerFine";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/* ── Scroll-scrubbed bio ─────────────────────────────────────────────────
   Words light up one by one as the paragraph scrolls through the viewport.
   Words wrapped in *asterisks* light up in the accent colour. */

function Word({ progress, range, accent, reduced, children }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <motion.span className={accent ? "hl" : undefined} style={{ opacity: reduced ? 1 : opacity }}>
        {children}
      </motion.span>{" "}
    </>
  );
}

function ScrubText({ text, className }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={w.startsWith("*")} reduced={reduced}>
          {w.replace(/\*/g, "")}
        </Word>
      ))}
    </p>
  );
}

/* ── 3D tilt that follows the pointer ──────────────────────────────────── */

function Tilt({ children, max = 7 }) {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 18 });
  const on = fine && !reduced;

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      style={{ height: "100%", rotateX: on ? rotateX : 0, rotateY: on ? rotateY : 0, transformPerspective: 900 }}
      onPointerMove={on ? move : undefined}
      onPointerLeave={on ? reset : undefined}
    >
      {children}
    </motion.div>
  );
}

/* ── Day/night card for London time ────────────────────────────────────── */

function londonNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZone: "Europe/London" }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { h: get("hour"), m: get("minute"), s: get("second") };
}

const SKIES = {
  night: "linear-gradient(180deg, #070b1f 0%, #141c45 70%, #26306a 100%)",
  dawn: "linear-gradient(180deg, #3b4a9e 0%, #c77d8f 65%, #f6b27a 100%)",
  day: "linear-gradient(180deg, #2f7fd0 0%, #67b4ec 60%, #b9e2fb 100%)",
  dusk: "linear-gradient(180deg, #2b2468 0%, #9a4f86 60%, #f08a5d 100%)",
};

function mood(h) {
  if (h < 7) return "Probably asleep 😴";
  if (h < 9) return "Coffee first ☕";
  if (h < 12) return "Deep work mode 🎧";
  if (h < 13) return "Lunch break 🥪";
  if (h < 18) return "Shipping things 🚀";
  if (h < 22) return "Reviews & US calls 🌎";
  return "Probably asleep 😴";
}

const STARS = Array.from({ length: 18 }, (_, i) => ({ x: (i * 53) % 100, y: (i * 37) % 60, d: (i % 5) * 0.6 }));

function SkyClock() {
  const [now, setNow] = useState(londonNow);
  useEffect(() => {
    const id = setInterval(() => setNow(londonNow()), 1000);
    return () => clearInterval(id);
  }, []);

  const hour = now.h + now.m / 60;
  const phase = hour < 5 || hour >= 21 ? "night" : hour < 8 ? "dawn" : hour < 17 ? "day" : "dusk";
  const isDay = hour >= 6 && hour < 20;
  // Sun travels 06:00 → 20:00, moon 20:00 → 06:00, both along the same arc.
  const t = isDay ? (hour - 6) / 14 : ((hour - 20 + 24) % 24) / 10;
  const x = 8 + t * 84;
  const y = 60 - Math.sin(Math.PI * t) * 44;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="sky-card" style={{ background: SKIES[phase] }}>
      {!isDay && STARS.map((s, i) => <i key={i} className="sky-star" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s` }} />)}
      <motion.span
        className={`sky-orb ${isDay ? "is-sun" : "is-moon"}`}
        animate={{ left: `${x}%`, top: `${y}%` }}
        transition={{ type: "spring", stiffness: 40, damping: 14 }}
      />
      <div className="sky-hills" />
      <div className="sky-content">
        <span className="sky-k">{resumeData.location} · my time</span>
        <div>
          <div className="sky-time mono">
            {pad(now.h)}:{pad(now.m)}
            <span>:{pad(now.s)}</span>
          </div>
          <div className="sky-mood">{mood(now.h)}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Fact roulette ─────────────────────────────────────────────────────── */

const FACTS = [
  "$500K+ in payments has flowed through Stripe integrations I built.",
  "I've been the sole engineer on 6+ client projects, from first commit to production.",
  "One of my Rails APIs handles 100+ requests a second in production.",
  "I work across UK and US time zones every week.",
  "As a team lead, I mentor junior developers and run the code reviews.",
  "I studied Computer Science at FAST NUCES in Lahore.",
  "I built four mini-games for this site. Scroll down and set a high score.",
  "There's a hidden terminal on this page. Press ` to open it.",
];

function FactRoulette() {
  const [i, setI] = useState(0);
  const [spin, setSpin] = useState(0);
  const next = () => {
    setSpin((s) => s + 1);
    setI((n) => {
      let r = n;
      while (r === n) r = Math.floor(Math.random() * FACTS.length);
      return r;
    });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="k">Random fact</span>
        <span className="mono" style={{ fontSize: 11.5, color: "var(--dim)" }}>{String(i + 1).padStart(2, "0")}/{String(FACTS.length).padStart(2, "0")}</span>
      </div>
      <p className="fact-text">
        <DecryptedText key={i} text={FACTS[i]} animateOn="view" speed={22} maxIterations={8} sequential revealDirection="start" encryptedClassName="fact-enc" />
      </p>
      <button type="button" className="fact-btn cursor-target" data-cursor-label="another!" onClick={next}>
        <motion.span animate={{ rotate: spin * 360 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ display: "grid" }}>
          <FiRefreshCw size={14} />
        </motion.span>
        Another one
      </button>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────────────── */

const STATS = [
  { to: 4, suffix: "+", label: "Years in production", icon: FiClock },
  { to: 6, suffix: "+", label: "SaaS platforms shipped", icon: FiLayers },
  { to: 500, prefix: "$", suffix: "K+", label: "GMV through my payment code", icon: FiCreditCard },
  { to: 2000, suffix: "+", separator: ",", label: "Active users served", icon: FiUsers },
];

const NOW = [
  { role: "Software Engineer", at: "Medical Guardian", where: "Remote · US", url: "https://www.medicalguardian.com/" },
  { role: "Software Engineer II · Team Lead", at: "Blackstack Software Solutions", where: "Lahore · remote", url: "https://bkstack.com/" },
];

const FACT_CHIPS = [
  `📍 ${resumeData.location}`,
  "🌍 Remote, any time zone",
  "🎓 BSc CS · FAST NUCES",
  "⚡ Async-first",
];

const BIO =
  "I'm a full-stack engineer who likes owning the whole thing: the *schema,* the *API,* the *interface* and the *deploy.* Over four years I've shipped *six* *production* *SaaS* *platforms* across logistics, fintech, sports and healthcare, often as the only engineer on the project.";

export function About() {
  const SPOT = useSpot();
  const learning = resumeData.skills.currentlyLearning?.map((s) => s.name) ?? [];

  return (
    <section className="sec" id="about">
      <div className="wrap">
        <SectionHead eyebrow="About" title="Hi, I'm Raza." accent="I build software that ships." />

        <div className="about-grid">
          <div className="about-story">
            <ScrubText text={BIO} className="about-bio" />
            <Reveal delay={0.05}>
              <p className="about-sub">
                Today I lead a development team at Blackstack, mentoring juniors and running code reviews, and build customer-facing UI at
                Medical Guardian. I care about clear ownership and integrations that survive real traffic.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="about-facts">
                <span className="chip about-status">
                  <span className="live-dot" /> {resumeData.availability.status}
                </span>
                {FACT_CHIPS.map((f) => (
                  <motion.span key={f} className="chip" whileHover={{ y: -3, rotate: -1.5 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                    {f}
                  </motion.span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <blockquote className="about-quote serif">“{resumeData.railsClosingLine}”</blockquote>
            </Reveal>
          </div>

          <div className="about-bento">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.label} delay={i * 0.06} style={{ height: "100%" }}>
                  <Tilt>
                    <SpotlightCard {...SPOT}>
                      <div className="stat-card">
                        <span className="stat-icon"><Icon size={16} /></span>
                        <div>
                          <div className="stat-num">
                            <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} separator={s.separator ?? ""} duration={2} />
                          </div>
                          <div style={{ color: "var(--muted)", marginTop: 10, fontSize: 13.5 }}>{s.label}</div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </Tilt>
                </Reveal>
              );
            })}

            <Reveal className="span-2" delay={0.08} style={{ height: "100%" }}>
              <SpotlightCard {...SPOT}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="k">Currently</span>
                  <span className="now-live"><span className="live-dot" /> live</span>
                </div>
                <div style={{ display: "grid", marginTop: 10 }}>
                  {NOW.map((r) => (
                    <a key={r.at} href={r.url} target="_blank" rel="noreferrer" className="now-row cursor-target" data-cursor-label="visit">
                      <span>
                        <span className="display" style={{ display: "block", fontSize: 18 }}>{r.at}</span>
                        <span style={{ color: "var(--muted)", fontSize: 13 }}>{r.role} · {r.where}</span>
                      </span>
                      <FiArrowUpRight className="now-arrow" />
                    </a>
                  ))}
                </div>
                {learning.length > 0 && (
                  <div className="now-learning">
                    <span className="mono">learning →</span>
                    {learning.map((l) => (
                      <span key={l} className="chip" style={{ fontSize: 12 }}>{l}</span>
                    ))}
                  </div>
                )}
              </SpotlightCard>
            </Reveal>

            <Reveal delay={0.12} style={{ height: "100%" }}>
              <Tilt max={5}>
                <SkyClock />
              </Tilt>
            </Reveal>

            <Reveal delay={0.16} style={{ height: "100%" }}>
              <SpotlightCard {...SPOT}>
                <FactRoulette />
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
