import React, { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import resumeData from "../../utils/resumeData";
import ScrollVelocity from "../../components/reactbits/ScrollVelocity";
import SpotlightCard from "../../components/reactbits/SpotlightCard";
import CountUp from "../../components/reactbits/CountUp";
import { Reveal, SectionHead } from "../parts";
import { useThemeMode } from "../../hooks/useThemeMode";

// One soft emerald light that follows the cursor across each card. SpotlightCard
// paints with real colours, so the tint is picked per theme.
export function useSpot() {
  const mode = useThemeMode();
  return {
    theme: mode,
    spotlightColor: mode === "dark" ? "#34d399" : "#059669",
    intensity: mode === "dark" ? 0.09 : 0.22,
    spotlightSize: 380,
    borderGlow: 0.6,
    style: {
      "--spotlight-card-surface": "var(--card)",
      "--spotlight-card-border": "var(--line)",
      "--spotlight-card-shadow": "none",
      borderRadius: 18,
      padding: 28,
      height: "100%",
    },
  };
}

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <ScrollVelocity
        texts={["React  ·  Next.js  ·  Ruby on Rails  ·  TypeScript  ·  Stripe  ·  PostgreSQL  ·  Redis  ·  OAuth 2.0  ·  AWS  ·  "]}
        velocity={28}
        className="marquee-text"
        numCopies={4}
        fadeEdges
      />
    </div>
  );
}

function UkClock() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/London" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const STATS = [
  { to: 4, suffix: "+", label: "Years in production" },
  { to: 6, suffix: "+", label: "SaaS platforms shipped" },
  { to: 500, prefix: "$", suffix: "K+", label: "GMV through my payment code" },
  { to: 2000, suffix: "+", separator: ",", label: "Active users served" },
];

export function Glance() {
  const SPOT = useSpot();
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <SectionHead
          eyebrow="About"
          title="Full-stack engineer,"
          accent="end-to-end owner."
          lead="From schema to deploy, I build and run production React/Next.js and Rails SaaS: architecture, payments, polished UI, and the quiet reliability work that keeps it all up."
        />

        <div className="bento">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} style={{ height: "100%" }}>
              <SpotlightCard {...SPOT}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", gap: 28 }}>
                  <span className="k">0{i + 1}</span>
                  <div>
                    <div className="stat-num">
                      <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} separator={s.separator ?? ""} duration={2} />
                    </div>
                    <div style={{ color: "var(--muted)", marginTop: 10, fontSize: 14 }}>{s.label}</div>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}

          <Reveal className="span-2" delay={0.08} style={{ height: "100%" }}>
            <SpotlightCard {...SPOT}>
              <span className="k">Currently</span>
              <div style={{ display: "grid", marginTop: 18 }}>
                {[
                  { role: "Software Engineer", at: "Medical Guardian", where: "Remote · US", url: "https://www.medicalguardian.com/" },
                  { role: "Software Engineer II · Team Lead", at: "Blackstack Software Solutions", where: "Lahore · remote", url: "https://blackstacksolutions.com/" },
                ].map((r, i) => (
                  <a
                    key={r.at}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-target"
                    data-cursor-label="visit"
                    style={{ textDecoration: "none", color: "inherit", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", padding: "16px 0", borderTop: i ? "1px solid var(--line)" : "none" }}
                  >
                    <span>
                      <span className="display" style={{ display: "block", fontSize: 19 }}>{r.at}</span>
                      <span style={{ color: "var(--muted)", fontSize: 13.5 }}>{r.role}</span>
                    </span>
                    <FiArrowUpRight style={{ color: "var(--dim)", flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.12} style={{ height: "100%" }}>
            <SpotlightCard {...SPOT}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", gap: 20 }}>
                <span className="k">{resumeData.location}</span>
                <div>
                  <div className="mono" style={{ fontSize: 26, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                    <UkClock />
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 8 }}>Local time · async-first</div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.16} style={{ height: "100%" }}>
            <SpotlightCard {...SPOT}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", gap: 20 }}>
                <span className="k">Motto</span>
                <p className="serif" style={{ fontSize: 22, lineHeight: 1.25, margin: 0, color: "var(--soft)" }}>
                  “{resumeData.railsClosingLine}”
                </p>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
