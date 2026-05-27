// Curated project suggestions keyed by pathway ID.
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

export const PROJECT_SUGGESTIONS = {
  frontend: [
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
      title: "Full-Stack CRUD App — The Odin Project",
      description:
        "Follow The Odin Project's structured curriculum to build a full inventory or blog app — from HTML/CSS basics all the way to a Node/Rails backend.",
      source: S.odin,
      tags: ["HTML", "CSS", "JavaScript"],
      difficulty: "beginner",
    },
  ],

  backend: [
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
      title: "Build Your Own Shell",
      description:
        "Write a POSIX-compatible shell that handles piping, redirections, background jobs, and built-in commands. Deep dive into process management.",
      source: S.byor,
      tags: ["C", "Python", "Linux", "Systems"],
      difficulty: "intermediate",
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
      title: "REST API with JWT Authentication",
      description:
        "Build a production-ready API with registration, login, token refresh, middleware-based route protection, and Swagger docs.",
      source: S.pbl,
      tags: ["Node.js", "Express", "JWT", "PostgreSQL"],
      difficulty: "beginner",
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
  ],

  devops: [
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
      title: "GitOps Deployment with ArgoCD",
      description:
        "Set up a GitOps workflow where merging to main automatically syncs a Kubernetes cluster via ArgoCD. Add rollback and health-check gates.",
      source: S.devopsExercises,
      tags: ["ArgoCD", "GitOps", "Kubernetes", "CI/CD"],
      difficulty: "advanced",
    },
  ],

  fullstack: [
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
  ],

  data: [
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
      title: "Build Your Own Neural Network from Scratch",
      description:
        "Implement forward propagation, back-propagation, and gradient descent using only NumPy — no frameworks. The deepest learning fundamentals project.",
      source: S.byor,
      tags: ["Python", "NumPy", "Math", "Deep Learning"],
      difficulty: "advanced",
    },
    {
      title: "Kaggle Competition — House Prices",
      description:
        "End-to-end regression pipeline: missing-value imputation, feature engineering, polynomial features, stacking ensemble, and leaderboard submission.",
      source: S.kaggle,
      tags: ["Python", "Pandas", "Scikit-learn", "Feature Engineering"],
      difficulty: "intermediate",
    },
  ],

  cybersecurity: [
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
  ],
}
