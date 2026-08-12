/** Interactive system flowchart — nodes, edges, and per-tech telemetry specs.
 *
 * Cluster `id` must match a grid-area name exactly: infra, integrations,
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
      deploymentNote: "Frontend for Errands and Fanlist, plus the Medical Guardian UAP web portal.",
    },
    {
      id: "react",
      name: "React.js",
      nodeClass: "Application Core",
      role: "Client SPAs — dashboards, patient/clinic portals, and role-based views.",
      deploymentNote: "Paired with Rails JSON APIs across Allergy Clinic, VUCustom, and Experfy.",
    },
    {
      id: "rails",
      name: "Ruby on Rails",
      nodeClass: "Application Core",
      role: "REST API backbone — ActiveRecord models, service objects, and background processing.",
      deploymentNote: "Backend for 6+ production SaaS platforms shipped as sole or lead engineer at Blackstack.",
    },
  ],
};

export const FLOW_CLUSTERS = [
  {
    id: "frontend",
    label: "FRONTEND",
    items: [
      { id: "tailwind", name: "TailwindCSS", nodeClass: "UI Library", role: "Utility-first styling for rapid, consistent UI.", deploymentNote: "Used across client React/Next.js builds." },
      { id: "mui", name: "Material UI", nodeClass: "UI Library", role: "Component library for dashboard and portal UIs.", deploymentNote: "VUCustom and Medical Guardian portal components." },
      { id: "typescript", name: "TypeScript", nodeClass: "Language", role: "Type-safe frontend development.", deploymentNote: "Medical Guardian customer portal and mobile app." },
      { id: "javascript", name: "JavaScript", nodeClass: "Language", role: "Core scripting across every client and server layer.", deploymentNote: "Shared by every shipped React/Next.js and Rails project." },
    ],
  },
  {
    id: "data",
    label: "DATA LAYER",
    items: [
      { id: "postgres", name: "PostgreSQL", nodeClass: "Database", role: "Primary relational store for high-traffic client platforms.", deploymentNote: "Errands' REST API handles 100+ req/s backed by PostgreSQL." },
      { id: "mysql", name: "MySQL", nodeClass: "Database", role: "Relational store for alternate client stacks.", deploymentNote: "Used across select Blackstack client projects." },
      { id: "redis", name: "Redis", nodeClass: "Cache", role: "Caching and job-queue backing store.", deploymentNote: "Backs the 60% API response-time reduction on Fanlist." },
      { id: "activerecord", name: "ActiveRecord", nodeClass: "ORM", role: "Rails ORM — models, associations, and query interface.", deploymentNote: "Core to every Rails backend shipped at Blackstack." },
    ],
  },
  {
    id: "infra",
    label: "INFRASTRUCTURE",
    items: [
      { id: "aws", name: "AWS", nodeClass: "Cloud", role: "EC2, RDS, and S3 for production hosting.", deploymentNote: "Client deployments across Blackstack's SaaS portfolio." },
      { id: "docker", name: "Docker", nodeClass: "Containers", role: "Consistent dev/prod environments.", deploymentNote: "Containerized client deployments." },
      { id: "ghactions", name: "GitHub Actions", nodeClass: "CI/CD", role: "Automated test and deploy pipelines.", deploymentNote: "RSpec + Jest gates on every PR." },
      { id: "heroku", name: "Heroku", nodeClass: "PaaS", role: "Rapid staging and client demo deployments.", deploymentNote: "Used across Blackstack client deliveries." },
    ],
  },
  {
    id: "integrations",
    label: "INTEGRATIONS",
    items: [
      { id: "node", name: "Node.js", nodeClass: "Runtime", role: "Backend services and tooling outside the Rails apps.", deploymentNote: "Supplementary services across select client projects." },
      { id: "rspec", name: "RSpec", nodeClass: "Testing", role: "Rails backend test suite.", deploymentNote: "Regression coverage on production client APIs." },
      { id: "jest", name: "Jest", nodeClass: "Testing", role: "Frontend test suite for critical user paths.", deploymentNote: "80%+ coverage on critical paths (Fanlist)." },
      { id: "oauth", name: "OAuth 2.0", nodeClass: "Auth", role: "Secure authentication and access-control flows.", deploymentNote: "Microsoft Entra ID integration at Medical Guardian." },
    ],
  },
  {
    id: "payments",
    label: "PAYMENTS",
    items: [
      { id: "stripe", name: "Stripe", nodeClass: "Payments", role: "Subscriptions and one-off payments with idempotent webhooks.", deploymentNote: "$500K+ GMV processed, zero failed transactions (Errands)." },
      { id: "chargebee", name: "Chargebee", nodeClass: "Payments", role: "Subscription billing and billing-cycle management.", deploymentNote: "SCA / 3D Secure–compliant subscription handling." },
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
