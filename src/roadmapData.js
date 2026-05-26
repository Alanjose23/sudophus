export const ROADMAPS = {
  frontend: {
    id: "frontend",
    title: "Frontend Developer",
    icon: "🌐",
    description: "Build user interfaces for the web using modern HTML, CSS, and JavaScript.",
    url: "https://roadmap.sh/frontend",
    groups: [
      {
        label: "Foundations",
        topics: [
          { id: "html", label: "HTML" },
          { id: "css", label: "CSS" },
          { id: "javascript", label: "JavaScript" },
        ],
      },
      {
        label: "CSS & Styling",
        topics: [
          { id: "responsive-design", label: "Responsive Design" },
          { id: "flexbox-grid", label: "Flexbox & Grid" },
          { id: "css-animations", label: "Animations & Transitions" },
          { id: "sass", label: "Sass / CSS Preprocessors" },
          { id: "tailwind", label: "Tailwind CSS" },
        ],
      },
      {
        label: "JavaScript Deep Dive",
        topics: [
          { id: "es6plus", label: "ES6+ Features" },
          { id: "dom", label: "DOM Manipulation" },
          { id: "fetch-api", label: "Fetch API / AJAX" },
          { id: "typescript-fe", label: "TypeScript" },
          { id: "async", label: "Async / Await & Promises" },
        ],
      },
      {
        label: "Tooling",
        topics: [
          { id: "git-fe", label: "Git & Version Control" },
          { id: "npm", label: "npm / Package Managers" },
          { id: "vite-fe", label: "Vite / Build Tools" },
          { id: "eslint-fe", label: "ESLint & Prettier" },
        ],
      },
      {
        label: "Frameworks & Libraries",
        topics: [
          { id: "react", label: "React" },
          { id: "vue", label: "Vue.js" },
          { id: "nextjs", label: "Next.js" },
          { id: "state-mgmt", label: "State Management (Zustand / Redux)" },
        ],
      },
      {
        label: "Testing & Deployment",
        topics: [
          { id: "vitest-fe", label: "Jest / Vitest" },
          { id: "testing-library-fe", label: "Testing Library" },
          { id: "e2e", label: "End-to-End Testing (Playwright)" },
          { id: "web-vitals", label: "Web Vitals & Performance" },
          { id: "deploy-fe", label: "Hosting & Deployment (Vercel / Netlify)" },
        ],
      },
    ],
  },

  backend: {
    id: "backend",
    title: "Backend Developer",
    icon: "⚙️",
    description: "Design and build server-side applications, APIs, and data infrastructure.",
    url: "https://roadmap.sh/backend",
    groups: [
      {
        label: "Foundations",
        topics: [
          { id: "internet-be", label: "Internet & HTTP Fundamentals" },
          { id: "linux-be", label: "Linux Basics" },
          { id: "cli-be", label: "Command Line Proficiency" },
          { id: "git-be", label: "Git & Version Control" },
        ],
      },
      {
        label: "Languages",
        topics: [
          { id: "nodejs", label: "Node.js" },
          { id: "python", label: "Python" },
          { id: "go", label: "Go" },
          { id: "java", label: "Java" },
          { id: "rust", label: "Rust" },
        ],
      },
      {
        label: "APIs & Frameworks",
        topics: [
          { id: "rest", label: "RESTful APIs" },
          { id: "graphql", label: "GraphQL" },
          { id: "express", label: "Express / Fastify" },
          { id: "fastapi", label: "FastAPI / Django" },
          { id: "grpc", label: "gRPC" },
        ],
      },
      {
        label: "Databases",
        topics: [
          { id: "sql", label: "SQL" },
          { id: "postgresql", label: "PostgreSQL" },
          { id: "mongodb", label: "MongoDB" },
          { id: "redis", label: "Redis & Caching" },
          { id: "orm", label: "ORMs & Query Builders" },
        ],
      },
      {
        label: "Authentication & Security",
        topics: [
          { id: "jwt", label: "JWT & Session Management" },
          { id: "oauth", label: "OAuth 2.0 & OpenID Connect" },
          { id: "owasp-be", label: "OWASP Top 10" },
          { id: "https-ssl", label: "HTTPS & TLS" },
        ],
      },
      {
        label: "Infrastructure",
        topics: [
          { id: "docker-be", label: "Docker & Containers" },
          { id: "kubernetes-be", label: "Kubernetes" },
          { id: "cicd-be", label: "CI/CD" },
          { id: "cloud-be", label: "Cloud Providers (AWS / GCP / Azure)" },
          { id: "queues", label: "Message Queues (Kafka / RabbitMQ)" },
        ],
      },
    ],
  },

  devops: {
    id: "devops",
    title: "DevOps / SRE",
    icon: "🔧",
    description: "Automate, scale, and maintain software delivery pipelines and infrastructure.",
    url: "https://roadmap.sh/devops",
    groups: [
      {
        label: "Operating Systems",
        topics: [
          { id: "linux-ops", label: "Linux Administration" },
          { id: "bash", label: "Shell Scripting (Bash)" },
          { id: "networking-ops", label: "Networking Fundamentals" },
        ],
      },
      {
        label: "Containers & Orchestration",
        topics: [
          { id: "docker-ops", label: "Docker" },
          { id: "docker-compose", label: "Docker Compose" },
          { id: "kubernetes-ops", label: "Kubernetes" },
          { id: "helm", label: "Helm" },
        ],
      },
      {
        label: "CI/CD",
        topics: [
          { id: "github-actions", label: "GitHub Actions" },
          { id: "jenkins", label: "Jenkins" },
          { id: "argocd", label: "ArgoCD / Flux" },
          { id: "gitops", label: "GitOps" },
        ],
      },
      {
        label: "Cloud Platforms",
        topics: [
          { id: "aws", label: "AWS" },
          { id: "gcp", label: "Google Cloud Platform" },
          { id: "azure", label: "Microsoft Azure" },
          { id: "serverless", label: "Serverless Architectures" },
        ],
      },
      {
        label: "Infrastructure as Code",
        topics: [
          { id: "terraform", label: "Terraform" },
          { id: "ansible", label: "Ansible" },
          { id: "pulumi", label: "Pulumi" },
        ],
      },
      {
        label: "Monitoring & Observability",
        topics: [
          { id: "prometheus", label: "Prometheus & Alerting" },
          { id: "grafana", label: "Grafana" },
          { id: "elk", label: "ELK Stack / Logging" },
          { id: "tracing", label: "Distributed Tracing" },
        ],
      },
    ],
  },

  fullstack: {
    id: "fullstack",
    title: "Full Stack Developer",
    icon: "🏗️",
    description: "Build complete web applications from the user interface to the data layer.",
    url: "https://roadmap.sh/full-stack",
    groups: [
      {
        label: "Frontend Core",
        topics: [
          { id: "fs-html-css", label: "HTML & CSS" },
          { id: "fs-js-ts", label: "JavaScript & TypeScript" },
          { id: "fs-framework", label: "React or Vue" },
          { id: "fs-responsive", label: "Responsive Design" },
        ],
      },
      {
        label: "Backend Core",
        topics: [
          { id: "fs-server", label: "Node.js / Server-Side Language" },
          { id: "fs-rest", label: "REST API Design" },
          { id: "fs-auth", label: "Authentication & Authorization" },
          { id: "fs-middleware", label: "Middleware Patterns" },
        ],
      },
      {
        label: "Databases",
        topics: [
          { id: "fs-sql", label: "Relational Databases (SQL)" },
          { id: "fs-nosql", label: "Document Databases (Firestore / MongoDB)" },
          { id: "fs-migrations", label: "Schema Design & Migrations" },
          { id: "fs-caching", label: "Caching Strategies" },
        ],
      },
      {
        label: "Architecture",
        topics: [
          { id: "fs-mvc", label: "MVC & Application Patterns" },
          { id: "fs-microservices", label: "Microservices vs Monolith" },
          { id: "fs-api-gateway", label: "API Gateways & BFF Pattern" },
        ],
      },
      {
        label: "Tooling & Deployment",
        topics: [
          { id: "fs-git", label: "Git & Version Control" },
          { id: "fs-docker", label: "Docker" },
          { id: "fs-cicd", label: "CI/CD Pipelines" },
          { id: "fs-cloud", label: "Cloud Deployment" },
          { id: "fs-testing", label: "Full Stack Testing" },
        ],
      },
    ],
  },

  data: {
    id: "data",
    title: "Data Science / ML",
    icon: "📊",
    description: "Analyse data, build machine learning models, and extract insight from information.",
    url: "https://roadmap.sh/ai-data-scientist",
    groups: [
      {
        label: "Foundations",
        topics: [
          { id: "ds-python", label: "Python for Data Science" },
          { id: "ds-stats", label: "Statistics & Probability" },
          { id: "ds-linalg", label: "Linear Algebra" },
          { id: "ds-calc", label: "Calculus Fundamentals" },
        ],
      },
      {
        label: "Data Manipulation",
        topics: [
          { id: "ds-numpy", label: "NumPy" },
          { id: "ds-pandas", label: "Pandas" },
          { id: "ds-sql", label: "SQL for Data Analysis" },
          { id: "ds-cleaning", label: "Data Cleaning & Preprocessing" },
        ],
      },
      {
        label: "Visualisation",
        topics: [
          { id: "ds-matplotlib", label: "Matplotlib & Seaborn" },
          { id: "ds-plotly", label: "Plotly / Interactive Charts" },
          { id: "ds-bi", label: "Tableau / BI Tools" },
        ],
      },
      {
        label: "Machine Learning",
        topics: [
          { id: "ds-sklearn", label: "Scikit-learn" },
          { id: "ds-supervised", label: "Supervised Learning" },
          { id: "ds-unsupervised", label: "Unsupervised Learning" },
          { id: "ds-feature-eng", label: "Feature Engineering" },
          { id: "ds-eval", label: "Model Evaluation & Validation" },
        ],
      },
      {
        label: "Deep Learning & MLOps",
        topics: [
          { id: "ds-pytorch", label: "PyTorch / TensorFlow" },
          { id: "ds-nlp", label: "Natural Language Processing" },
          { id: "ds-cv", label: "Computer Vision" },
          { id: "ds-mlflow", label: "MLflow / Experiment Tracking" },
          { id: "ds-deploy", label: "Model Deployment" },
        ],
      },
    ],
  },

  cybersecurity: {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: "🔒",
    description: "Protect systems, networks, and data from digital attacks and unauthorised access.",
    url: "https://roadmap.sh/cyber-security",
    groups: [
      {
        label: "Foundations",
        topics: [
          { id: "sec-networking", label: "Networking (TCP/IP, DNS, HTTP)" },
          { id: "sec-linux", label: "Linux & Command Line" },
          { id: "sec-scripting", label: "Scripting (Python / Bash)" },
          { id: "sec-crypto", label: "Cryptography Fundamentals" },
        ],
      },
      {
        label: "Core Concepts",
        topics: [
          { id: "sec-cia", label: "CIA Triad & Security Principles" },
          { id: "sec-threats", label: "Threat Modelling" },
          { id: "sec-owasp", label: "OWASP Top 10" },
          { id: "sec-auth", label: "Authentication & Identity" },
        ],
      },
      {
        label: "Offensive Security",
        topics: [
          { id: "sec-recon", label: "Reconnaissance & OSINT" },
          { id: "sec-scanning", label: "Vulnerability Scanning (Nmap / Nessus)" },
          { id: "sec-web-hacking", label: "Web Application Hacking" },
          { id: "sec-pentest", label: "Penetration Testing Methodology" },
        ],
      },
      {
        label: "Defensive Security",
        topics: [
          { id: "sec-siem", label: "SIEM & Log Analysis" },
          { id: "sec-incident", label: "Incident Response" },
          { id: "sec-forensics", label: "Digital Forensics" },
          { id: "sec-hardening", label: "System Hardening" },
        ],
      },
      {
        label: "Compliance & Certifications",
        topics: [
          { id: "sec-comptia", label: "CompTIA Security+" },
          { id: "sec-oscp", label: "CEH / OSCP" },
          { id: "sec-compliance", label: "GDPR / SOC 2 / ISO 27001" },
        ],
      },
    ],
  },
}
