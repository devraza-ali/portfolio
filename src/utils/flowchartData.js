/** Interactive system flowchart — nodes, edges, and per-tech telemetry specs.
 *
 * NOTE: cluster.x / cluster.y / cluster.w have been removed. The component now
 * places clusters with CSS Grid named areas (see SystemFlowchart.jsx), so each
 * cluster's `id` below must match a grid-area name exactly: infra, integrations,
 * frontend, data, payments. No manual coordinates needed — rows auto-size to
 * content, so this can't overlap regardless of how many items a cluster has.
 */

export const FLOW_CORE = {
  id: "core",
  label: "CORE ENGINE",
  items: [
    {
      id: "nextjs",
      name: "Next.js",
      nodeClass: "Application Core",
      role: "Full-stack React framework — SSR/SSG frontends and API routes.",
      deploymentNote: "Frontend for Errands and Fanlist, plus the Medical Guardian customer web portal.",
    },
    {
      id: "react",
      name: "React.js",
      nodeClass: "Application Core",
      role: "Client SPAs — dashboards, auth flows, integration-heavy UIs with role-based views.",
      deploymentNote: "Paired with Rails JSON APIs across 6+ shipped SaaS products.",
    },
    {
      id: "rails-core",
      name: "Ruby on Rails",
      nodeClass: "Application Core",
      role: "REST API backbone — ActiveRecord, service objects, and background jobs.",
      deploymentNote: "Powers Errands, Allergy Clinic Management, and Fanlist in production.",
    },
  ],
};

export const FLOW_CLUSTERS = [
  {
    id: "frontend",
    label: "FRONTEND",
    items: [
      { id: "typescript", name: "TypeScript", nodeClass: "Language", role: "Typed frontend code across production React apps.", deploymentNote: "Used daily on the Medical Guardian customer portal." },
      { id: "mui", name: "Material UI", nodeClass: "UI Library", role: "Component library for dashboard-heavy interfaces.", deploymentNote: "Client project UI work at Blackstack." },
      { id: "tailwind", name: "TailwindCSS", nodeClass: "UI Library", role: "Utility-first styling for rapid, consistent UI.", deploymentNote: "Portfolio and greenfield client UI work." },
      { id: "figma", name: "Figma-to-Code", nodeClass: "Design", role: "Pixel-perfect, accessible delivery straight from design files.", deploymentNote: "Core workflow at Medical Guardian." },
    ],
  },
  {
    id: "data",
    label: "DATA LAYER",
    items: [
      { id: "postgres", name: "PostgreSQL", nodeClass: "Database", role: "Primary relational store — indexing and query tuning for high-traffic reads.", deploymentNote: "60% API response-time reduction on Fanlist via query optimization." },
      { id: "mysql", name: "MySQL", nodeClass: "Database", role: "Relational store on legacy/client-specified stacks.", deploymentNote: "Used on select Blackstack client projects." },
      { id: "redis", name: "Redis", nodeClass: "Cache / Queue", role: "Caching layer for real-time, high-traffic features.", deploymentNote: "Backs caching on Fanlist's personalized content feeds." },
      { id: "activerecord", name: "ActiveRecord", nodeClass: "ORM", role: "Rails data layer — associations, scopes, migrations.", deploymentNote: "Standard ORM across every Rails backend shipped." },
    ],
  },
  {
    id: "infra",
    label: "INFRASTRUCTURE",
    items: [
      { id: "aws", name: "AWS", nodeClass: "Cloud", role: "EC2, RDS, S3 for production hosting.", deploymentNote: "Backing infrastructure for Blackstack client deployments." },
      { id: "docker", name: "Docker", nodeClass: "Containers", role: "Consistent dev/prod environments and service isolation.", deploymentNote: "Standard across Blackstack client projects." },
      { id: "ghactions", name: "GitHub Actions", nodeClass: "CI/CD", role: "Automated test and deploy pipelines.", deploymentNote: "RSpec + Jest gates on every PR, 40% fewer deployment errors on VUCustom." },
      { id: "heroku", name: "Heroku", nodeClass: "PaaS", role: "Rapid staging and client demo deployments.", deploymentNote: "Used across consultancy client deliveries." },
    ],
  },
  {
    id: "integrations",
    label: "INTEGRATIONS",
    items: [
      { id: "entra", name: "Microsoft Entra ID", nodeClass: "Auth", role: "Enterprise identity and access control.", deploymentNote: "Authentication & Authorization team collaboration at Medical Guardian." },
      { id: "graph", name: "Microsoft Graph API", nodeClass: "API", role: "Microsoft 365 data and identity integration.", deploymentNote: "Paired with Entra ID at Medical Guardian." },
      { id: "third-party", name: "Third-Party APIs", nodeClass: "Integration", role: "Cross-platform integrations spanning logistics, sports, and clinic-management data.", deploymentNote: "Errands, Fanlist, and Allergy Clinic Management." },
      { id: "realtime", name: "Real-Time Updates", nodeClass: "Live Data", role: "No-refresh UI updates for dashboard-heavy products.", deploymentNote: "Fanlist's personalized live content feed." },
    ],
  },
  {
    id: "payments",
    label: "PAYMENTS & AUTH",
    items: [
      { id: "stripe", name: "Stripe", nodeClass: "Payments", role: "Subscription billing with idempotent webhooks.", deploymentNote: "$500K+ GMV processed on Errands with zero failed transactions." },
      { id: "chargebee", name: "Chargebee", nodeClass: "Payments", role: "Subscription and billing-cycle management.", deploymentNote: "Client billing infrastructure at Blackstack." },
      { id: "oauth", name: "OAuth 2.0", nodeClass: "Auth", role: "Secure authentication and access-control flows.", deploymentNote: "Core auth pattern across client and Medical Guardian work." },
    ],
  },
];

/** Edges from cluster → core (only `from` is used, to draw a connector into the core) */
export const FLOW_EDGES = [
  { from: "infra", to: "core" },
  { from: "integrations", to: "core" },
  { from: "frontend", to: "core" },
  { from: "data", to: "core" },
  { from: "payments", to: "core" },
];

export const ALL_FLOW_ITEMS = [
  ...FLOW_CORE.items,
  ...FLOW_CLUSTERS.flatMap(c => c.items),
];

export function getFlowItem(id) {
  return ALL_FLOW_ITEMS.find(i => i.id === id) ?? FLOW_CORE.items[0];
}
