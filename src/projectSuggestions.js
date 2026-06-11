// Curated project suggestions keyed by pathway ID.
// Every pathway carries exactly 4 beginner, 4 intermediate, and 4 advanced
// projects so the UI can cycle through difficulty tiers.
// Every URL here is a real, well-known programming-education resource.

export const SUGGESTION_SOURCES = {
  byor: {
    name: "build-your-own-x",
    url: "https://github.com/codecrafters-io/build-your-own-x",
  },
  pbl: {
    name: "project-based-learning",
    url: "https://github.com/practical-tutorials/project-based-learning",
  },
  appIdeas: {
    name: "florinpop17/app-ideas",
    url: "https://github.com/florinpop17/app-ideas",
  },
  js30: {
    name: "JavaScript 30",
    url: "https://javascript30.com",
  },
  fso: {
    name: "Full Stack Open",
    url: "https://fullstackopen.com/en/",
  },
  odin: {
    name: "The Odin Project",
    url: "https://theodinproject.com/",
  },
  devopsExercises: {
    name: "devops-exercises",
    url: "https://github.com/bregman-arie/devops-exercises",
  },
  kaggle: {
    name: "Kaggle",
    url: "https://www.kaggle.com/",
  },
  thm: {
    name: "TryHackMe",
    url: "https://tryhackme.com/",
  },
  htb: {
    name: "Hack The Box",
    url: "https://www.hackthebox.com/",
  },
  webgoat: {
    name: "OWASP WebGoat",
    url: "https://github.com/WebGoat/WebGoat",
  },
  roadmapProjects: {
    name: "roadmap.sh/projects",
    url: "https://roadmap.sh/projects",
  },
}

const S = SUGGESTION_SOURCES

export const DIFFICULTY_TIERS = ["beginner", "intermediate", "advanced"]

export const TIER_LABELS = {
  beginner: "Easy",
  intermediate: "Medium",
  advanced: "Advanced",
}

export const PROJECT_SUGGESTIONS = {
  frontend: [
    /* ── Easy ─────────────────────────────── */
    {
      title: "JavaScript 30-Day Vanilla Challenge",
      description:
        "Build 30 projects in 30 days using only vanilla JavaScript — clocks, drum kits, flex panels, and more. The best hands-on intro to the DOM.",
      source: S.js30,
      tags: ["JavaScript", "DOM", "CSS"],
      difficulty: "beginner",
    },
    {
      title: "Flashcard / Quiz App",
      description:
        "Build a spaced-repetition flashcard app with local storage persistence, flip animations, and a score tracker. Great first React/Vue project.",
      source: S.appIdeas,
      tags: ["React", "CSS Animations", "LocalStorage"],
      difficulty: "beginner",
    },
    {
      title: "Full-Stack CRUD App — The Odin Project",
      description:
        "Follow The Odin Project's structured curriculum to build a full inventory or blog app — from HTML/CSS basics all the way to a Node/Rails backend.",
      source: S.odin,
      tags: ["HTML", "CSS", "JavaScript"],
      difficulty: "beginner",
    },
    {
      title: "Personal Portfolio Site",
      description:
        "Design and ship a responsive portfolio with semantic HTML, modern CSS layout (Grid/Flexbox), dark mode, and a contact form. Your first real deploy.",
      source: S.odin,
      tags: ["HTML", "CSS", "Responsive Design"],
      difficulty: "beginner",
    },

    /* ── Medium ───────────────────────────── */
    {
      title: "Weather Dashboard",
      description:
        "Fetch live data from a weather API, display 5-day forecasts, city search, and unit toggling. Covers async/await, Fetch API, and responsive layouts.",
      source: S.appIdeas,
      tags: ["JavaScript", "Fetch API", "Responsive Design"],
      difficulty: "intermediate",
    },
    {
      title: "Drag-and-Drop Kanban Board",
      description:
        "A Trello-style board with drag-and-drop columns, card creation, and local storage. Teaches state management and the HTML5 Drag-and-Drop API.",
      source: S.appIdeas,
      tags: ["React", "State Management", "CSS"],
      difficulty: "intermediate",
    },
    {
      title: "Markdown Editor with Live Preview",
      description:
        "A split-pane editor that parses Markdown and renders HTML in real-time. Add syntax highlighting, toolbar buttons, and export to HTML.",
      source: S.appIdeas,
      tags: ["React", "JavaScript", "CSS"],
      difficulty: "intermediate",
    },
    {
      title: "Personal Finance Tracker with Charts",
      description:
        "Track income and expenses with category breakdowns, monthly charts, and budgets. Teaches data modelling, chart libraries, and derived state.",
      source: S.appIdeas,
      tags: ["React", "Charts", "LocalStorage"],
      difficulty: "intermediate",
    },

    /* ── Advanced ─────────────────────────── */
    {
      title: "Build Your Own Front-End Framework",
      description:
        "Implement a minimal virtual DOM, a diffing algorithm, and a reactivity system from scratch — the best way to understand how React and Vue really work.",
      source: S.byor,
      tags: ["JavaScript", "Virtual DOM", "Advanced"],
      difficulty: "advanced",
    },
    {
      title: "Component Library with Storybook",
      description:
        "Design and document a reusable UI component library (buttons, modals, tables). Publish to npm and write visual tests. Real-world front-end engineering.",
      source: S.roadmapProjects,
      tags: ["React", "TypeScript", "Storybook"],
      difficulty: "advanced",
    },
    {
      title: "Offline-First Progressive Web App",
      description:
        "Build an installable PWA with service workers, cache strategies, background sync, and push notifications. Covers the full offline-first architecture.",
      source: S.roadmapProjects,
      tags: ["PWA", "Service Workers", "JavaScript"],
      difficulty: "advanced",
    },
    {
      title: "Real-Time Collaborative Whiteboard",
      description:
        "Multiple users draw on a shared canvas with live cursors and presence. Teaches Canvas API, WebSockets, and conflict-free state synchronisation.",
      source: S.appIdeas,
      tags: ["Canvas", "WebSockets", "React"],
      difficulty: "advanced",
    },
  ],

  backend: [
    /* ── Easy ─────────────────────────────── */
    {
      title: "REST API with JWT Authentication",
      description:
        "Build a production-ready API with registration, login, token refresh, middleware-based route protection, and Swagger docs.",
      source: S.pbl,
      tags: ["Node.js", "Express", "JWT", "PostgreSQL"],
      difficulty: "beginner",
    },
    {
      title: "URL Shortener Service",
      description:
        "Design a service that shortens URLs, redirects visitors, and tracks click counts. A compact intro to routing, persistence, and unique ID generation.",
      source: S.roadmapProjects,
      tags: ["Node.js", "Databases", "APIs"],
      difficulty: "beginner",
    },
    {
      title: "Task Tracker CLI",
      description:
        "A command-line task manager that persists to a JSON file — add, list, complete, and delete tasks. Teaches argument parsing and file I/O.",
      source: S.roadmapProjects,
      tags: ["Python", "Node.js", "CLI"],
      difficulty: "beginner",
    },
    {
      title: "Caching Proxy Server",
      description:
        "Build a forwarding proxy that caches upstream responses with TTL expiry and cache-control headers. A gentle on-ramp to HTTP semantics.",
      source: S.roadmapProjects,
      tags: ["HTTP", "Caching", "Networking"],
      difficulty: "beginner",
    },

    /* ── Medium ───────────────────────────── */
    {
      title: "Build Your Own HTTP Server",
      description:
        "Implement an HTTP/1.1 server from raw TCP sockets: parse request headers, route requests, return status codes, and handle keep-alive connections.",
      source: S.byor,
      tags: ["Python", "Node.js", "Go", "Networking"],
      difficulty: "intermediate",
    },
    {
      title: "Build Your Own Redis",
      description:
        "Recreate core Redis commands (GET, SET, EXPIRE, LPUSH) over a TCP socket. Understand in-memory storage, serialisation formats, and TTL eviction.",
      source: S.byor,
      tags: ["Python", "Node.js", "Systems", "Caching"],
      difficulty: "intermediate",
    },
    {
      title: "Task Queue / Background Job System",
      description:
        "Build a job queue backed by Redis or a database, with workers, retries, priority lanes, and a dashboard. Models real production async architecture.",
      source: S.roadmapProjects,
      tags: ["Node.js", "Redis", "Queues", "Backend"],
      difficulty: "intermediate",
    },
    {
      title: "GraphQL API with Subscriptions",
      description:
        "Design a schema-first GraphQL server with queries, mutations, real-time subscriptions, and DataLoader for N+1 query prevention.",
      source: S.pbl,
      tags: ["GraphQL", "Node.js", "WebSockets"],
      difficulty: "intermediate",
    },

    /* ── Advanced ─────────────────────────── */
    {
      title: "Build Your Own Shell",
      description:
        "Write a POSIX-compatible shell that handles piping, redirections, background jobs, and built-in commands. Deep dive into process management.",
      source: S.byor,
      tags: ["C", "Python", "Linux", "Systems"],
      difficulty: "advanced",
    },
    {
      title: "Build Your Own Git",
      description:
        "Implement git init, add, commit, log, and branch using SHA-1 objects and packfiles. Nothing demystifies version control like rebuilding it.",
      source: S.byor,
      tags: ["Python", "Go", "Systems", "Cryptography"],
      difficulty: "advanced",
    },
    {
      title: "Build Your Own SQL Database",
      description:
        "Implement a B-tree storage engine, a SQL parser, and a query planner. The most rigorous backend fundamentals project you can attempt.",
      source: S.byor,
      tags: ["C", "Python", "Databases", "Systems"],
      difficulty: "advanced",
    },
    {
      title: "Build Your Own Container Runtime",
      description:
        "Use Linux namespaces, cgroups, and chroot to isolate a process the way Docker does. Demystifies containers at the syscall level.",
      source: S.byor,
      tags: ["Go", "Linux", "Containers", "Systems"],
      difficulty: "advanced",
    },
  ],

  devops: [
    /* ── Easy ─────────────────────────────── */
    {
      title: "Containerise a Full-Stack App with Docker Compose",
      description:
        "Take any web application, write Dockerfiles for each service, wire them together with Compose, and add a reverse proxy (Nginx/Traefik).",
      source: S.devopsExercises,
      tags: ["Docker", "Docker Compose", "Nginx"],
      difficulty: "beginner",
    },
    {
      title: "CI/CD Pipeline with GitHub Actions",
      description:
        "Build a pipeline that lints, tests, builds a Docker image, pushes to a registry, and deploys to a cloud VM or Kubernetes cluster on every push.",
      source: S.devopsExercises,
      tags: ["GitHub Actions", "CI/CD", "Docker"],
      difficulty: "beginner",
    },
    {
      title: "Host a Static Site with Nginx + HTTPS",
      description:
        "Provision a Linux VM, configure Nginx, point a domain at it, and automate TLS certificates with Let's Encrypt. The classic first-ops project.",
      source: S.devopsExercises,
      tags: ["Nginx", "Linux", "TLS", "DNS"],
      difficulty: "beginner",
    },
    {
      title: "Linux Server Setup & Hardening",
      description:
        "Set up a fresh server with SSH keys, a firewall (ufw), fail2ban, automatic updates, and non-root users. Foundational sysadmin hygiene.",
      source: S.devopsExercises,
      tags: ["Linux", "SSH", "Security"],
      difficulty: "beginner",
    },

    /* ── Medium ───────────────────────────── */
    {
      title: "Deploy an App to Kubernetes on Minikube",
      description:
        "Write Deployments, Services, ConfigMaps, Ingress, and HPA YAML. Roll out updates, simulate pod failures, and practise kubectl debugging.",
      source: S.devopsExercises,
      tags: ["Kubernetes", "Minikube", "YAML", "Helm"],
      difficulty: "intermediate",
    },
    {
      title: "Provision Cloud Infrastructure with Terraform",
      description:
        "Use Terraform to create a VPC, EC2 instances, RDS, and an ELB on AWS (or equivalent on GCP/Azure). Practice modules, state, and workspaces.",
      source: S.devopsExercises,
      tags: ["Terraform", "AWS", "Infrastructure as Code"],
      difficulty: "intermediate",
    },
    {
      title: "Prometheus + Grafana Monitoring Stack",
      description:
        "Instrument an application with Prometheus metrics, build Grafana dashboards, set up alerting rules, and integrate with Alertmanager.",
      source: S.devopsExercises,
      tags: ["Prometheus", "Grafana", "Observability"],
      difficulty: "intermediate",
    },
    {
      title: "Configuration Management with Ansible",
      description:
        "Write idempotent playbooks that configure a fleet of servers — packages, users, services, and app deploys — from a single inventory.",
      source: S.devopsExercises,
      tags: ["Ansible", "Linux", "Automation"],
      difficulty: "intermediate",
    },

    /* ── Advanced ─────────────────────────── */
    {
      title: "GitOps Deployment with ArgoCD",
      description:
        "Set up a GitOps workflow where merging to main automatically syncs a Kubernetes cluster via ArgoCD. Add rollback and health-check gates.",
      source: S.devopsExercises,
      tags: ["ArgoCD", "GitOps", "Kubernetes", "CI/CD"],
      difficulty: "advanced",
    },
    {
      title: "Service Mesh with Istio",
      description:
        "Add Istio to a microservices cluster: mutual TLS between services, traffic splitting for canary releases, and distributed tracing.",
      source: S.devopsExercises,
      tags: ["Istio", "Kubernetes", "Microservices"],
      difficulty: "advanced",
    },
    {
      title: "Write a Kubernetes Operator",
      description:
        "Build a custom controller in Go that watches a CRD and reconciles cluster state. The deepest way to learn how Kubernetes actually works.",
      source: S.devopsExercises,
      tags: ["Go", "Kubernetes", "Operators"],
      difficulty: "advanced",
    },
    {
      title: "Centralised Logging Pipeline (ELK/Loki)",
      description:
        "Ship logs from every service into Elasticsearch or Loki with structured fields, retention policies, and saved queries for incident response.",
      source: S.devopsExercises,
      tags: ["ELK", "Loki", "Observability", "Logging"],
      difficulty: "advanced",
    },
  ],

  fullstack: [
    /* ── Easy ─────────────────────────────── */
    {
      title: "Full Stack Open — University of Helsinki",
      description:
        "A university-grade free course building a full app across React, Node/Express, MongoDB, GraphQL, TypeScript, and CI/CD. The best structured curriculum available.",
      source: S.fso,
      tags: ["React", "Node.js", "MongoDB", "GraphQL"],
      difficulty: "beginner",
    },
    {
      title: "The Odin Project",
      description:
        "An open-source full-stack curriculum covering HTML/CSS through React and Node/Rails with real portfolio projects at every stage.",
      source: S.odin,
      tags: ["HTML", "CSS", "JavaScript", "Node.js"],
      difficulty: "beginner",
    },
    {
      title: "Notes App with Auth (Full-Stack CRUD)",
      description:
        "A personal notes app with sign-up, login, and per-user CRUD over a REST API. The cleanest end-to-end slice of the full stack.",
      source: S.appIdeas,
      tags: ["React", "Node.js", "Auth", "PostgreSQL"],
      difficulty: "beginner",
    },
    {
      title: "Full-Stack URL Shortener",
      description:
        "Shorten links, track click analytics, and show per-user dashboards. Small enough to finish, complete enough to deploy and share.",
      source: S.roadmapProjects,
      tags: ["React", "Node.js", "Databases"],
      difficulty: "beginner",
    },

    /* ── Medium ───────────────────────────── */
    {
      title: "Real-Time Chat Application",
      description:
        "Build a multi-room chat app with user auth, Socket.io rooms, message persistence, and online presence indicators. Covers full-stack WebSocket flows.",
      source: S.pbl,
      tags: ["React", "Node.js", "Socket.io", "MongoDB"],
      difficulty: "intermediate",
    },
    {
      title: "Blog Platform with CMS",
      description:
        "Public-facing blog with a private admin CMS — Markdown posts, image uploads, categories, pagination, RSS, and SEO meta tags. Touches every full-stack layer.",
      source: S.appIdeas,
      tags: ["React", "Node.js", "PostgreSQL", "File Upload"],
      difficulty: "intermediate",
    },
    {
      title: "Expense Splitter (Splitwise Clone)",
      description:
        "Groups, shared expenses, and who-owes-whom settlement math. Great practice for relational modelling and non-trivial business logic.",
      source: S.appIdeas,
      tags: ["React", "Node.js", "PostgreSQL"],
      difficulty: "intermediate",
    },
    {
      title: "Project Management Board (Trello Clone)",
      description:
        "Boards, lists, drag-and-drop cards, labels, and team invites — persisted to a real backend with optimistic UI updates.",
      source: S.appIdeas,
      tags: ["React", "Drag and Drop", "Node.js"],
      difficulty: "intermediate",
    },

    /* ── Advanced ─────────────────────────── */
    {
      title: "E-Commerce Store with Payments",
      description:
        "Product catalogue, cart, checkout flow with Stripe integration, order history, and an admin inventory dashboard. A full production-grade app.",
      source: S.roadmapProjects,
      tags: ["React", "Node.js", "Stripe", "Auth"],
      difficulty: "advanced",
    },
    {
      title: "Social Media Platform",
      description:
        "Users, follows, feeds, likes, comments, notifications, and image uploads. Challenges every part of full-stack architecture: auth, feeds, real-time events.",
      source: S.appIdeas,
      tags: ["React", "Node.js", "WebSockets", "Auth"],
      difficulty: "advanced",
    },
    {
      title: "Collaborative Document Editor",
      description:
        "Google-Docs-style live editing with multiple cursors using CRDTs or operational transforms. The hardest sync problem in full-stack engineering.",
      source: S.pbl,
      tags: ["CRDT", "WebSockets", "React", "Node.js"],
      difficulty: "advanced",
    },
    {
      title: "Video Streaming Platform",
      description:
        "Upload, transcode to HLS, and stream video with adaptive bitrate, thumbnails, and resumable playback. Covers media pipelines and CDNs.",
      source: S.roadmapProjects,
      tags: ["Node.js", "FFmpeg", "HLS", "Storage"],
      difficulty: "advanced",
    },
  ],

  data: [
    /* ── Easy ─────────────────────────────── */
    {
      title: "Titanic Survival Predictor",
      description:
        "The classic entry-point Kaggle competition. Explore the dataset, engineer features, and compare Logistic Regression, Random Forest, and XGBoost.",
      source: S.kaggle,
      tags: ["Python", "Pandas", "Scikit-learn", "EDA"],
      difficulty: "beginner",
    },
    {
      title: "Stock Price Visualisation Dashboard",
      description:
        "Fetch historical OHLCV data, build candlestick charts, add moving averages and volume overlays. Great intro to Pandas, Plotly, and time-series data.",
      source: S.pbl,
      tags: ["Python", "Pandas", "Plotly", "APIs"],
      difficulty: "beginner",
    },
    {
      title: "Exploratory Data Analysis Portfolio Piece",
      description:
        "Pick a real public dataset, clean it, and publish a narrative EDA notebook with visualisations and conclusions. The core data-science workflow.",
      source: S.kaggle,
      tags: ["Python", "Pandas", "Matplotlib", "EDA"],
      difficulty: "beginner",
    },
    {
      title: "Web Scraper + Data Pipeline",
      description:
        "Scrape a public site on a schedule, clean and store the results in SQLite/Postgres, and chart trends over time. Data engineering in miniature.",
      source: S.pbl,
      tags: ["Python", "BeautifulSoup", "SQL"],
      difficulty: "beginner",
    },

    /* ── Medium ───────────────────────────── */
    {
      title: "Sentiment Analyser for Product Reviews",
      description:
        "Fine-tune a TF-IDF + Logistic Regression or a pre-trained transformer on an Amazon/Yelp review dataset. Build a simple Gradio demo.",
      source: S.pbl,
      tags: ["Python", "NLP", "Scikit-learn", "Transformers"],
      difficulty: "intermediate",
    },
    {
      title: "Movie Recommendation System",
      description:
        "Implement collaborative filtering (SVD) and content-based recommendations on the MovieLens dataset. Compare RMSE across approaches.",
      source: S.pbl,
      tags: ["Python", "Pandas", "Scikit-learn", "NumPy"],
      difficulty: "intermediate",
    },
    {
      title: "Image Classifier with a CNN",
      description:
        "Train a convolutional neural network on CIFAR-10 or a custom scraped dataset using PyTorch. Track experiments with MLflow and deploy via FastAPI.",
      source: S.pbl,
      tags: ["Python", "PyTorch", "Computer Vision", "MLflow"],
      difficulty: "intermediate",
    },
    {
      title: "Kaggle Competition — House Prices",
      description:
        "End-to-end regression pipeline: missing-value imputation, feature engineering, polynomial features, stacking ensemble, and leaderboard submission.",
      source: S.kaggle,
      tags: ["Python", "Pandas", "Scikit-learn", "Feature Engineering"],
      difficulty: "intermediate",
    },

    /* ── Advanced ─────────────────────────── */
    {
      title: "Build Your Own Neural Network from Scratch",
      description:
        "Implement forward propagation, back-propagation, and gradient descent using only NumPy — no frameworks. The deepest learning fundamentals project.",
      source: S.byor,
      tags: ["Python", "NumPy", "Math", "Deep Learning"],
      difficulty: "advanced",
    },
    {
      title: "Build a GPT-Style Language Model",
      description:
        "Implement tokenisation, attention, and a small transformer trained on a text corpus. Demystifies how modern LLMs actually work.",
      source: S.byor,
      tags: ["Python", "PyTorch", "Transformers", "NLP"],
      difficulty: "advanced",
    },
    {
      title: "End-to-End MLOps Pipeline",
      description:
        "Version data and models, automate training, serve predictions behind an API, and monitor drift in production. The full ML lifecycle.",
      source: S.roadmapProjects,
      tags: ["MLflow", "Docker", "FastAPI", "Monitoring"],
      difficulty: "advanced",
    },
    {
      title: "Real-Time Streaming Data Pipeline",
      description:
        "Ingest events with Kafka, process them with Spark or Flink, and land aggregates in a warehouse with a live dashboard on top.",
      source: S.pbl,
      tags: ["Kafka", "Spark", "Python", "Data Engineering"],
      difficulty: "advanced",
    },
  ],

  cybersecurity: [
    /* ── Easy ─────────────────────────────── */
    {
      title: "TryHackMe Learning Paths",
      description:
        "Guided, browser-based labs covering Linux basics, networking, web exploitation, and CTF challenges. The smoothest on-ramp into practical security.",
      source: S.thm,
      tags: ["Linux", "Networking", "CTF", "Web Security"],
      difficulty: "beginner",
    },
    {
      title: "OWASP WebGoat — Web Vulnerability Labs",
      description:
        "A deliberately insecure app that teaches you to exploit SQL injection, XSS, IDOR, broken auth, and CSRF in a safe local environment.",
      source: S.webgoat,
      tags: ["OWASP", "SQL Injection", "XSS", "Web Security"],
      difficulty: "beginner",
    },
    {
      title: "Build a Home Security Lab",
      description:
        "Set up isolated VMs (attacker box, victim box, firewall) with VirtualBox or Proxmox so you can practise techniques safely and legally.",
      source: S.htb,
      tags: ["Virtualisation", "Networking", "Lab Setup"],
      difficulty: "beginner",
    },
    {
      title: "Traffic Analysis with Wireshark",
      description:
        "Capture and dissect your own network traffic: follow TCP streams, inspect DNS and TLS handshakes, and spot anomalies in sample captures.",
      source: S.thm,
      tags: ["Wireshark", "Networking", "Blue Team"],
      difficulty: "beginner",
    },

    /* ── Medium ───────────────────────────── */
    {
      title: "Build a Port Scanner",
      description:
        "Write a threaded TCP/UDP port scanner in Python — banner grabbing, service fingerprinting, and output formatting. Understand what Nmap does under the hood.",
      source: S.byor,
      tags: ["Python", "Networking", "Sockets", "Security"],
      difficulty: "intermediate",
    },
    {
      title: "Hack The Box Challenges",
      description:
        "Real-world penetration testing labs: compromise machines, escalate privileges, and capture flags. The industry standard for practical offensive skills.",
      source: S.htb,
      tags: ["Pentesting", "CTF", "Linux", "Privilege Escalation"],
      difficulty: "intermediate",
    },
    {
      title: "Build a Password Manager",
      description:
        "Implement AES-256 encryption, PBKDF2 key derivation, and a master-password-protected vault. Teaches cryptography and secure storage patterns.",
      source: S.pbl,
      tags: ["Python", "Cryptography", "Security", "CLI"],
      difficulty: "intermediate",
    },
    {
      title: "Pentest OWASP Juice Shop",
      description:
        "Work through the OWASP Juice Shop challenge board — a modern, deliberately vulnerable web app — and write a findings report like a professional.",
      source: S.webgoat,
      tags: ["OWASP", "Web Security", "Reporting"],
      difficulty: "intermediate",
    },

    /* ── Advanced ─────────────────────────── */
    {
      title: "Network Packet Analyser",
      description:
        "Build a Wireshark-lite tool that captures packets, parses Ethernet/IP/TCP headers, and displays protocol details. Deepens networking fundamentals.",
      source: S.byor,
      tags: ["Python", "Networking", "Scapy", "Protocols"],
      difficulty: "advanced",
    },
    {
      title: "SIEM Lab with the ELK Stack",
      description:
        "Ingest firewall, auth, and application logs into Elasticsearch, build Kibana dashboards, and write detection rules using Watcher or Sigma.",
      source: S.pbl,
      tags: ["ELK", "SIEM", "Log Analysis", "Kibana"],
      difficulty: "advanced",
    },
    {
      title: "Build a Vulnerability Scanner",
      description:
        "Combine port scanning, service fingerprinting, and CVE lookups into a tool that produces a prioritised report for hosts you own.",
      source: S.byor,
      tags: ["Python", "CVE", "Automation", "Security"],
      difficulty: "advanced",
    },
    {
      title: "Active Directory Attack & Detection Lab",
      description:
        "Stand up a small AD domain, run common attack paths against it, then build the detections that catch each one. Red and blue in one lab.",
      source: S.htb,
      tags: ["Active Directory", "Detection", "Blue Team"],
      difficulty: "advanced",
    },
  ],
}
