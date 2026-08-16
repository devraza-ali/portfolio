// Raza Ali Malik — portfolio single source of truth

const resumeData = {
  name: "Raza Ali Malik",
  title: "Full-Stack Software Engineer",
  titles: [
    "Full-Stack Software Engineer",
    "React.js / Next.js Developer",
    "Ruby on Rails Developer",
    "Payments & Integrations Specialist",
    "Team Lead",
  ],
  tagline: "React · Next.js · Rails — production SaaS, owned end-to-end",
  headline:
    "Full-stack engineer building and owning production React/Next.js + Ruby on Rails SaaS systems — from architecture and payments to polished UI. Currently a Software Engineer at Medical Guardian (remote) and Team Lead at Blackstack Software Solutions. Open to remote roles globally.",

  email: "devraza.ali@gmail.com",
  location: "Luton, UK",
  timezone: "UK (GMT+0/BST) · open to any time zone — async-first",
  phone: "+44 7463 504810",
  portfolioUrl: "https://razaali.is-a.dev",
  linkedinUrl: "https://www.linkedin.com/in/raza-malik-81109a268",
  githubUrl: "https://github.com/devraza-ali",
  photo: "/raza-ali-no-bg.png",

  availability: {
    status: "Available immediately",
    modes: [
      "Full-time — remote (global)",
      "Contract — remote (global)",
    ],
    note: "Currently Software Engineer at Medical Guardian (remote) and Team Lead at Blackstack Software Solutions. Open to new remote opportunities worldwide.",
  },

  credibilityStrip: [
    "6+ SaaS Platforms Shipped",
    "$500K+ GMV Processed",
    "2,000+ Active Users Served",
    "100% On-Time Delivery",
  ],

  summary:
    "Full-stack engineer with 4+ years production experience across 6+ SaaS platforms spanning logistics, fintech, sports, and clinic management. Led end-to-end development of 6+ client projects as sole developer at Blackstack Software Solutions — handling architecture, frontend, backend, payments, and production deployment. Expert in React/Next.js frontends and Rails backends, with $500K+ GMV processed through Stripe integrations and systems serving 2,000+ active users. Now leading a development team as Software Engineer II, mentoring junior developers and running code reviews, while also shipping customer-facing UI at Medical Guardian (remote, US-based). FAST NUCES graduate (tier-1 university).",

  aboutExtra:
    "I care about clear ownership — from schema to deploy — and integrations that survive real traffic. Comfortable working solo as the only engineer on a client project, or leading a team through code review and architecture decisions.",

  // ── Engineering highlights pillars ────────────────────────────────────────
  railsProficiency: [
    {
      icon: "architecture",
      title: "Architecture & Performance",
      points: [
        "REST APIs handling 100+ requests/second in production (Errands)",
        "Page load optimization: 4.2s → 1.8s via code-splitting and bundle tuning",
        "Database indexing and query optimization for a 60% API response-time reduction (Fanlist)",
        "40% bundle-size reduction through frontend optimization",
      ],
    },
    {
      icon: "payments",
      title: "Payments & Billing",
      points: [
        "Stripe integration with idempotent webhooks — zero failed transactions across $500K+ GMV processed",
        "Subscription handling with SCA/3D Secure, plus Chargebee billing",
        "Production payment flows serving 2,000+ active users at 99.5% uptime",
      ],
    },
    {
      icon: "integrations",
      title: "Data & Integrations",
      points: [
        "Multi-tenant platform features shipped across 5+ sub-brands (VUCustom)",
        "Third-party API integrations across logistics, sports, and clinic-management platforms",
        "PostgreSQL, MySQL, and Redis backing real-time, high-traffic features",
      ],
    },
    {
      icon: "auth",
      title: "Auth & Frontend Delivery",
      points: [
        "OAuth 2.0 flows and secure authentication integration, including Microsoft Entra ID at Medical Guardian",
        "Figma-to-code delivery of pixel-perfect, accessible, responsive UI",
        "Jest testing with 80%+ coverage on critical paths",
      ],
    },
  ],
  railsClosingLine: "Ownership isn't a title I hold — it's how I ship.",

  // ── Experience ────────────────────────────────────────────────────────────
  experience: [
    {
      company: "Blackstack Software Solutions",
      companyUrl: "https://blackstacksolutions.com/",
      location: "Lahore, Pakistan",
      roles: [
        { title: "Software Engineer II (Team Lead)", duration: "Jan 2025 — Present" },
        { title: "Software Engineer I / Associate", duration: "Sep 2023 — Dec 2024" },
      ],
      summary:
        "Product studio shipping React/Next.js + Rails SaaS for clients across logistics, sports, clinic management, and B2C/B2B platforms. Sole or lead engineer across 6+ client projects — full ownership from requirements to production deployment. Now leading a development team: mentoring juniors, running code reviews, managing technical architecture, and ensuring 100% on-time delivery.",
      projects: [
        {
          name: "Errands",
          url: "https://app.errandsdash.com/",
          flagship: true,
          role: "Sole Developer",
          description: "Shipping & logistics platform — Next.js frontend, Rails backend, PostgreSQL, built and owned end to end.",
          tech: ["Next.js", "Ruby on Rails", "PostgreSQL", "Stripe", "REST API"],
          problem: "Client needed a scalable shipping and logistics platform that could handle high request volume, process payments reliably, and load fast for a growing user base.",
          metrics: [
            "Served 2,000+ users, processing $50K+ monthly GMV",
            "REST API handling 100+ requests/second",
            "Reduced page load 4.2s → 1.8s via optimization and code-splitting",
            "Integrated Stripe with idempotent webhooks — zero failed transactions",
            "99.5% uptime, zero critical incidents during user growth",
          ],
        },
        {
          name: "Allergy Clinic Management",
          url: "https://allergy.entas.org/",
          role: "Solo Full-Stack Ownership",
          description: "Custom clinic platform for patient records, allergy tracking, appointments, and workflows.",
          tech: ["React.js", "Ruby on Rails", "PostgreSQL"],
          problem: "Clinic relied on manual, paper-based tracking for allergy management, vaccinations, patient records, and appointments — slow and error-prone.",
          metrics: [
            "Automated 50+ daily manual entries → 70% reduction in admin overhead",
            "Deployed to production supporting 200+ patient records, zero downtime",
            "99% feature adoption per client feedback — \"transformed clinic operations\"",
            "Now core to the clinic's daily ops, 500+ monthly interactions",
          ],
        },
        {
          name: "Fanlist",
          url: "https://www.fanlist.com/",
          description: "Sports fan engagement platform with real-time, personalized content feeds.",
          tech: ["Next.js", "Ruby on Rails", "Jest"],
          metrics: [
            "1,000+ active users, real-time personalized content",
            "60% API response-time reduction via caching and query optimization",
            "40% frontend bundle-size reduction via optimization",
            "80%+ Jest coverage on critical paths",
          ],
        },
        {
          name: "VUCustom",
          url: "https://vucustom.com/",
          description: "Multi-tenant B2C platform — developed features for the LAX brand across 5+ sub-brands.",
          tech: ["React.js", "Ruby on Rails", "Multi-tenant"],
          metrics: [
            "Built B2C features for the LAX brand across a multi-tenant platform (5+ sub-brands)",
            "Led client demos and managed scope — 8+ features shipped on schedule",
            "Reduced deployment errors 40% via automation",
          ],
        },
        {
          name: "Experfy",
          url: "https://www.experfy.com/",
          description: "Backend development on a large-scale React + Rails platform supporting enterprise-level applications.",
          tech: ["React.js", "Ruby on Rails", "REST API"],
          metrics: ["Designed and optimized RESTful APIs, improving performance and reliability"],
        },
        {
          name: "NEXO & CrossFit RRG",
          url: "https://app2.crossfitrrg.com/",
          description: "Maintained and enhanced legacy React (class-based) and Rails applications for two production clients.",
          tech: ["React.js", "Ruby on Rails"],
          metrics: ["Worked directly with clients on requirements, technical support, and production reliability"],
        },
      ],
    },
    {
      role: "Software Engineer",
      company: "Medical Guardian",
      companyUrl: "https://www.medicalguardian.com/",
      location: "Philadelphia, PA, USA (Remote)",
      duration: "Jan 2025 — Present",
      points: [
        "Built and maintained responsive UIs for the customer web portal, marketing portal, and mobile app using React, TypeScript, and modern frontend tooling.",
        "Translated Figma designs into pixel-perfect, accessible, responsive interfaces; contributed to UI/UX improvements and reusable components.",
        "Integrated frontend applications with backend APIs, collaborating closely with backend engineers on scalable end-to-end features.",
        "Partnered with the Authentication & Authorization team on secure authentication and access control, including Microsoft Entra ID and OAuth 2.0.",
        "Worked in an Agile environment with product managers, designers, and QA — code reviews, testing, and 2-week sprint production deployments.",
        "Recognized for consistent, high-quality delivery.",
      ],
    },
  ],

  // ── Education ─────────────────────────────────────────────────────────────
  education: [
    {
      degree: "B.Sc. Computer Science",
      institution: "FAST NUCES (Tier-1 University), Lahore",
      duration: "2019 — 2023",
      coursework: ["Data Structures & Algorithms", "Database Systems", "Software Engineering", "Web Technologies", "Operating Systems", "Computer Networks"],
    },
  ],

  // ── Skills — with detail arrays for expandable pills ─────────────────────
  skills: {
    backend: [
      { name: "Ruby on Rails 5/6/7" },
      { name: "Node.js" },
      { name: "REST API design" },
      { name: "ActiveRecord" },
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "Redis" },
    ],
    frontend: [
      { name: "React.js" },
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "JavaScript (ES6+)" },
      { name: "TailwindCSS" },
      { name: "Material UI (MUI)" },
      { name: "Responsive Design" },
      { name: "Figma-to-Code" },
    ],
    payments: [
      { name: "Stripe", detail: ["Subscriptions", "Idempotent webhooks", "SCA / 3D Secure"] },
      { name: "Chargebee", detail: ["Subscriptions", "Billing cycles"] },
    ],
    integrations: [
      { name: "OAuth 2.0" },
      { name: "Microsoft Entra ID", detail: ["Authentication & access control (Medical Guardian)"] },
      { name: "Microsoft Graph API" },
      { name: "Third-party API integrations" },
      { name: "Real-time updates" },
    ],
    testingAndDevOps: [
      { name: "Jest", detail: ["80%+ coverage on critical paths"] },
      { name: "RSpec" },
      { name: "GitHub Actions CI/CD" },
      { name: "Docker" },
      { name: "Heroku" },
      { name: "AWS", detail: ["EC2", "RDS", "S3"] },
    ],
    currentlyLearning: [
      { name: "Microsoft Entra ID" },
      { name: "Microsoft Graph API" },
    ],
    also: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "Agile/Scrum" },
      { name: "Figma" },
      { name: "Visual Studio Code" },
    ],
  },

  // ── Open source — none published ──────────────────────────────────────────
  openSource: {
    combinedDownloads: 0,
    rubygemsProfile: "",
    gems: [],
  },

  // ── Testimonials — none collected yet ─────────────────────────────────────
  testimonials: [],

  // ── Personal projects — none published yet ────────────────────────────────
  projects: [],

  // ── Engineering practices ─────────────────────────────────────────────────
  engineeringPractices: [
    "REST API design with explicit contracts and validation",
    "Automated tests where they protect regressions (RSpec, Jest)",
    "Git workflows with meaningful review and small diffs",
    "Idempotent payment integrations (Stripe, Chargebee)",
    "Figma-to-code UI work — pixel-perfect and accessible",
    "Code reviews and mentoring as a team lead",
    "Async-first communication across distributed teams",
  ],

  resumeDownloads: [
    { label: "Download Resume (Full-Stack)", file: "/Raza_Ali_Malik.pdf" },
    { label: "Download Resume (Remote-Focused)", file: "/Raza_Ali_Malik_Remote.pdf" },
  ],
};

export default resumeData;
