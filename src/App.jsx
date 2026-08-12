import React, { useEffect, useState } from "react";
import "./index.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import {
  HeroSection,
  MetricsSection,
  RailsShowcaseSection,
  CaseStudiesSection,
  SkillsSection,
  ProcessSection,
  TechStackSection,
  ExperienceSection,
  AboutSection,
  ContactSection,
} from "./components/sections/index";

export default function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--primary)", fontFamily: "'Inter',sans-serif" }}>
      <Nav theme={theme} toggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      <main>
        <HeroSection />
        <MetricsSection />
        <RailsShowcaseSection />
        <CaseStudiesSection />
        <SkillsSection />
        <ProcessSection />
        <TechStackSection />
        <ExperienceSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
