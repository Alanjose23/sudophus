// Single icon library for the app, per the Halo design system: Lucide,
// rendered at hairline stroke weights and tinted via currentColor.
import {
  Atom, BarChart3, BookOpen, Bot, Boxes, Brain, Brush, Cable, Calculator,
  CheckCircle2, ClipboardList, Cloud, CloudUpload, Code2, Coffee, Container,
  Database, Eye, FileCode, Flame, FlaskConical, Gauge, GitBranch,
  Globe, GraduationCap, Hammer, Hash, Heart, Hourglass, Inbox, KeyRound,
  Layers, LayoutGrid, Leaf, Lightbulb, LineChart, Link2, Lock, Map,
  MessageCircle, Microscope, Network, NotebookPen, Package, Palette,
  PieChart, RadioTower, RefreshCw, Rocket, Sailboat, Search, SearchCheck,
  Server, ServerCog, Settings, ShieldCheck, Siren, Smartphone, Sparkles,
  Table, Target, Terminal, TestTube, Triangle, Trophy, Waves, Workflow,
  Wrench, Zap,
} from "lucide-react"

const PATHWAY_ICONS = {
  frontend:      Globe,
  backend:       ServerCog,
  devops:        Wrench,
  fullstack:     Layers,
  data:          BarChart3,
  cybersecurity: ShieldCheck,
}

export function PathwayIcon({ id, size = 18, ...props }) {
  const C = PATHWAY_ICONS[id]
  if (!C) return null
  return <C size={size} strokeWidth={1.75} aria-hidden="true" {...props} />
}

const TOPIC_ICON_MAP = {
  // ── Frontend ─────────────────────────────────────────────────────
  html: Code2, css: Palette, javascript: Zap, "responsive-design": Smartphone,
  "flexbox-grid": LayoutGrid, "css-animations": Sparkles, sass: Brush,
  tailwind: Waves, es6plus: Rocket, dom: Globe, "fetch-api": RadioTower,
  "typescript-fe": FileCode, async: Hourglass, "git-fe": GitBranch,
  npm: Package, "vite-fe": Zap, "eslint-fe": SearchCheck, react: Atom,
  vue: Heart, nextjs: Triangle, "state-mgmt": Boxes, "vitest-fe": TestTube,
  "testing-library-fe": FlaskConical, e2e: Bot, "web-vitals": Gauge,
  "deploy-fe": CloudUpload,

  // ── Backend ───────────────────────────────────────────────────────
  "internet-be": Globe, "linux-be": Terminal, "cli-be": Terminal,
  "git-be": GitBranch, nodejs: Server, python: Code2, go: Zap, java: Coffee,
  rust: Settings, rest: Link2, graphql: Network, express: Server,
  fastapi: Zap, grpc: Cable, sql: Database, postgresql: Database,
  mongodb: Leaf, redis: Heart, orm: RefreshCw, jwt: KeyRound, oauth: Lock,
  "owasp-be": ShieldCheck, "https-ssl": Lock, "docker-be": Container,
  "kubernetes-be": Workflow, "cicd-be": RefreshCw, "cloud-be": Cloud,
  queues: Inbox,

  // ── DevOps ───────────────────────────────────────────────────────
  "linux-ops": Terminal, bash: Terminal, "networking-ops": Network,
  "docker-ops": Container, "docker-compose": Boxes,
  "kubernetes-ops": Workflow, helm: Sailboat, "github-actions": Workflow,
  jenkins: Bot, argocd: RefreshCw, gitops: GitBranch, aws: Cloud,
  gcp: Cloud, azure: Cloud, serverless: Zap, terraform: Hammer,
  ansible: Wrench, pulumi: Hammer, prometheus: BarChart3,
  grafana: LineChart, elk: ClipboardList, tracing: Search,

  // ── Full Stack ────────────────────────────────────────────────────
  "fs-html-css": Palette, "fs-js-ts": Zap, "fs-framework": Atom,
  "fs-responsive": Smartphone, "fs-server": Server, "fs-rest": Link2,
  "fs-auth": Lock, "fs-middleware": Workflow, "fs-sql": Database,
  "fs-nosql": Leaf, "fs-migrations": RefreshCw, "fs-caching": Zap,
  "fs-mvc": Layers, "fs-microservices": Boxes, "fs-api-gateway": Network,
  "fs-git": GitBranch, "fs-docker": Container, "fs-cicd": RefreshCw,
  "fs-cloud": Cloud, "fs-testing": TestTube,

  // ── Data Science / ML ─────────────────────────────────────────────
  "ds-python": Code2, "ds-stats": BarChart3, "ds-linalg": Hash,
  "ds-calc": Calculator, "ds-numpy": Hash, "ds-pandas": Table,
  "ds-sql": Database, "ds-cleaning": Brush, "ds-matplotlib": LineChart,
  "ds-plotly": PieChart, "ds-bi": ClipboardList, "ds-sklearn": Bot,
  "ds-supervised": GraduationCap, "ds-unsupervised": Search,
  "ds-feature-eng": Settings, "ds-eval": CheckCircle2, "ds-pytorch": Flame,
  "ds-nlp": MessageCircle, "ds-cv": Eye, "ds-mlflow": LineChart,
  "ds-deploy": Rocket,

  // ── Cybersecurity ─────────────────────────────────────────────────
  "sec-networking": Network, "sec-linux": Terminal,
  "sec-scripting": Terminal, "sec-crypto": Lock, "sec-cia": ShieldCheck,
  "sec-threats": Siren, "sec-owasp": SearchCheck, "sec-auth": KeyRound,
  "sec-recon": Search, "sec-scanning": SearchCheck,
  "sec-web-hacking": Code2, "sec-pentest": Target, "sec-siem": BarChart3,
  "sec-incident": Siren, "sec-forensics": Microscope,
  "sec-hardening": Lock, "sec-comptia": GraduationCap, "sec-oscp": Trophy,
  "sec-compliance": ClipboardList,
}

export function TopicIcon({ id, size = 14, ...props }) {
  const C = TOPIC_ICON_MAP[id]
  if (!C) return null
  return <C size={size} strokeWidth={1.75} aria-hidden="true" {...props} />
}

/* LinkedIn brand glyph — Lucide dropped brand icons, so this is the one
   hand-rolled exception, shared by every share button. */
export function LinkedInIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

// Re-export the handful of shared glyphs pages use directly, so every
// consumer pulls from one place and stroke weight stays consistent.
export {
  BookOpen, Brain, Flame, Lightbulb, Map, NotebookPen, Rocket, KeyRound,
  RefreshCw, ShieldCheck,
}
