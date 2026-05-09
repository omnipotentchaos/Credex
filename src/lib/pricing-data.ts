// ============================================================
// BurnLens — Pricing Data Constants
// All prices verified May 2026. Sources in PRICING_DATA.md
// ============================================================

export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface PlanInfo {
  id: string;
  name: string;
  pricePerSeat: number; // Monthly price per seat in USD. 0 = free, -1 = custom/contact sales
  features: string[];
  bestFor: string; // Short description of ideal user
  minSeats?: number;
  isApi?: boolean; // True if this is an API / usage-based plan
}

export interface ToolInfo {
  id: ToolId;
  name: string;
  vendor: string;
  category: "ide" | "chat" | "api";
  primaryUseCases: UseCase[];
  plans: PlanInfo[];
  pricingUrl: string;
  color: string; // For UI badges
}

// ============================================================
// CURSOR
// Source: https://www.cursor.com/pricing — verified 2026-05-10
// ============================================================
const cursor: ToolInfo = {
  id: "cursor",
  name: "Cursor",
  vendor: "Anysphere",
  category: "ide",
  primaryUseCases: ["coding"],
  color: "#6366f1",
  pricingUrl: "https://www.cursor.com/pricing",
  plans: [
    {
      id: "cursor-hobby",
      name: "Hobby",
      pricePerSeat: 0,
      features: ["Limited agent requests", "Limited tab completions"],
      bestFor: "Individual hobbyists trying Cursor",
    },
    {
      id: "cursor-pro",
      name: "Pro",
      pricePerSeat: 20,
      features: [
        "Extended agent limits",
        "Frontier models",
        "MCPs, skills, hooks",
        "Cloud agents",
      ],
      bestFor: "Individual developers using AI daily",
    },
    {
      id: "cursor-business",
      name: "Teams",
      pricePerSeat: 40,
      features: [
        "Everything in Pro",
        "Shared chats & rules",
        "Centralized billing",
        "Usage analytics",
        "Privacy mode",
        "RBAC",
        "SAML/OIDC SSO",
      ],
      bestFor: "Teams needing shared config and admin controls",
      minSeats: 2,
    },
    {
      id: "cursor-enterprise",
      name: "Enterprise",
      pricePerSeat: -1,
      features: [
        "Everything in Teams",
        "Pooled usage",
        "Invoice billing",
        "SCIM",
        "Audit logs",
        "Priority support",
      ],
      bestFor: "Large orgs with compliance/security needs",
      minSeats: 10,
    },
  ],
};

// ============================================================
// GITHUB COPILOT
// Source: https://github.com/features/copilot/plans — verified 2026-05-10
// ============================================================
const githubCopilot: ToolInfo = {
  id: "github-copilot",
  name: "GitHub Copilot",
  vendor: "GitHub / Microsoft",
  category: "ide",
  primaryUseCases: ["coding"],
  color: "#2b3137",
  pricingUrl: "https://github.com/features/copilot/plans",
  plans: [
    {
      id: "copilot-free",
      name: "Free",
      pricePerSeat: 0,
      features: [
        "50 chat requests/mo",
        "2000 completions/mo",
        "Haiku 4.5, GPT-5 mini",
      ],
      bestFor: "Students and hobbyists",
    },
    {
      id: "copilot-pro",
      name: "Pro",
      pricePerSeat: 10,
      features: [
        "Unlimited completions",
        "300 premium requests",
        "Cloud agent",
        "Code review",
        "Claude & Codex on GitHub",
      ],
      bestFor: "Individual professional developers",
    },
    {
      id: "copilot-pro-plus",
      name: "Pro+",
      pricePerSeat: 39,
      features: [
        "Everything in Pro",
        "All models incl. Claude Opus",
        "5x premium requests",
        "GitHub Spark",
      ],
      bestFor: "Power users needing frontier models",
    },
    {
      id: "copilot-business",
      name: "Business",
      pricePerSeat: 19,
      features: [
        "Organization-wide policies",
        "IP indemnity",
        "SAML SSO",
        "Usage metrics",
        "Data excluded from training",
      ],
      bestFor: "Teams needing admin controls and compliance",
      minSeats: 2,
    },
    {
      id: "copilot-enterprise",
      name: "Enterprise",
      pricePerSeat: 39,
      features: [
        "Everything in Business",
        "Codebase indexing",
        "Fine-tuned models",
        "GitHub.com integration",
      ],
      bestFor: "Large orgs wanting deep codebase understanding",
      minSeats: 10,
    },
  ],
};

// ============================================================
// CLAUDE (Anthropic consumer plans)
// Source: https://www.anthropic.com/pricing — verified 2026-05-10
// ============================================================
const claude: ToolInfo = {
  id: "claude",
  name: "Claude",
  vendor: "Anthropic",
  category: "chat",
  primaryUseCases: ["coding", "writing", "research", "data"],
  color: "#d97706",
  pricingUrl: "https://www.anthropic.com/pricing",
  plans: [
    {
      id: "claude-free",
      name: "Free",
      pricePerSeat: 0,
      features: [
        "Web, iOS, Android, Desktop",
        "Code generation",
        "Web search",
        "Memory",
        "Extended thinking",
      ],
      bestFor: "Casual users and evaluation",
    },
    {
      id: "claude-pro",
      name: "Pro",
      pricePerSeat: 20,
      features: [
        "More usage",
        "Claude Code",
        "Claude Cowork",
        "Unlimited projects",
        "Research",
        "Microsoft 365 integration",
      ],
      bestFor: "Individual professionals and power users",
    },
    {
      id: "claude-max-5x",
      name: "Max (5x)",
      pricePerSeat: 100,
      features: [
        "5x more usage than Pro",
        "Higher output limits",
        "Early access to features",
        "Priority access",
      ],
      bestFor: "Heavy individual users needing max capacity",
    },
    {
      id: "claude-max-20x",
      name: "Max (20x)",
      pricePerSeat: 200,
      features: [
        "20x more usage than Pro",
        "Highest output limits",
        "Early access to features",
        "Priority access",
      ],
      bestFor: "Extreme power users",
    },
    {
      id: "claude-team",
      name: "Team",
      pricePerSeat: 25,
      features: [
        "Claude Code & Cowork",
        "Microsoft 365 & Slack",
        "Enterprise search",
        "Central billing",
        "SSO",
        "Admin controls",
        "No training on content",
      ],
      bestFor: "Small-medium teams needing collaboration",
      minSeats: 2,
    },
    {
      id: "claude-enterprise",
      name: "Enterprise",
      pricePerSeat: -1,
      features: [
        "Spend controls",
        "SCIM",
        "Audit logs",
        "Compliance API",
        "Custom data retention",
        "HIPAA-ready",
      ],
      bestFor: "Large orgs with strict compliance needs",
      minSeats: 10,
    },
  ],
};

// ============================================================
// CHATGPT (OpenAI consumer plans)
// Source: https://openai.com/chatgpt/pricing — verified 2026-05-10
// ============================================================
const chatgpt: ToolInfo = {
  id: "chatgpt",
  name: "ChatGPT",
  vendor: "OpenAI",
  category: "chat",
  primaryUseCases: ["coding", "writing", "research", "data", "mixed"],
  color: "#10a37f",
  pricingUrl: "https://openai.com/chatgpt/pricing",
  plans: [
    {
      id: "chatgpt-free",
      name: "Free",
      pricePerSeat: 0,
      features: ["GPT-5 mini", "Limited messages", "Web search"],
      bestFor: "Casual users",
    },
    {
      id: "chatgpt-plus",
      name: "Plus",
      pricePerSeat: 20,
      features: [
        "GPT-5",
        "DALL-E",
        "Advanced data analysis",
        "Higher limits",
        "Custom GPTs",
      ],
      bestFor: "Individual professionals",
    },
    {
      id: "chatgpt-team",
      name: "Team",
      pricePerSeat: 25,
      features: [
        "Everything in Plus",
        "Shared workspaces",
        "Admin console",
        "Data not used for training",
        "SAML SSO",
        "60+ integrations",
      ],
      bestFor: "Small-medium teams",
      minSeats: 2,
    },
    {
      id: "chatgpt-enterprise",
      name: "Enterprise",
      pricePerSeat: -1,
      features: [
        "Unlimited GPT-5",
        "Advanced admin",
        "SCIM",
        "SSO",
        "Audit logs",
        "Custom data retention",
      ],
      bestFor: "Large organizations 150+ seats",
      minSeats: 150,
    },
  ],
};

// ============================================================
// ANTHROPIC API DIRECT
// Source: https://www.anthropic.com/pricing#api — verified 2026-05-10
// ============================================================
const anthropicApi: ToolInfo = {
  id: "anthropic-api",
  name: "Anthropic API",
  vendor: "Anthropic",
  category: "api",
  primaryUseCases: ["coding", "writing", "data", "research"],
  color: "#d97706",
  pricingUrl: "https://www.anthropic.com/pricing#api",
  plans: [
    {
      id: "anthropic-api-direct",
      name: "API Direct",
      pricePerSeat: 0,
      isApi: true,
      features: [
        "Pay per token",
        "Opus, Sonnet, Haiku models",
        "Usage-based pricing",
      ],
      bestFor: "Developers building applications with Claude",
    },
  ],
};

// ============================================================
// OPENAI API DIRECT
// Source: https://openai.com/pricing — verified 2026-05-10
// ============================================================
const openaiApi: ToolInfo = {
  id: "openai-api",
  name: "OpenAI API",
  vendor: "OpenAI",
  category: "api",
  primaryUseCases: ["coding", "writing", "data", "research"],
  color: "#10a37f",
  pricingUrl: "https://openai.com/pricing",
  plans: [
    {
      id: "openai-api-direct",
      name: "API Direct",
      pricePerSeat: 0,
      isApi: true,
      features: [
        "Pay per token",
        "GPT-5, GPT-5 mini, Codex",
        "Usage-based pricing",
      ],
      bestFor: "Developers building applications with OpenAI models",
    },
  ],
};

// ============================================================
// GEMINI (Google consumer plans + API)
// Source: https://one.google.com/about/plans — verified 2026-05-10
//         https://ai.google.dev/pricing — verified 2026-05-10
// ============================================================
const gemini: ToolInfo = {
  id: "gemini",
  name: "Gemini",
  vendor: "Google",
  category: "chat",
  primaryUseCases: ["writing", "research", "data", "coding"],
  color: "#4285f4",
  pricingUrl: "https://ai.google.dev/pricing",
  plans: [
    {
      id: "gemini-free",
      name: "Free",
      pricePerSeat: 0,
      features: [
        "Gemini Flash models",
        "Limited access",
        "Google AI Studio",
      ],
      bestFor: "Casual users and evaluation",
    },
    {
      id: "gemini-advanced",
      name: "Advanced (AI Premium)",
      pricePerSeat: 20,
      features: [
        "Gemini 2.5 Pro",
        "1M token context",
        "Google One AI Premium",
        "2TB storage",
        "Gemini in Workspace",
      ],
      bestFor: "Individual professionals in Google ecosystem",
    },
    {
      id: "gemini-api",
      name: "API (Pay-as-you-go)",
      pricePerSeat: 0,
      isApi: true,
      features: [
        "Pay per token",
        "Gemini 3 Flash, 2.5 Pro",
        "Free tier available",
        "Context caching",
        "Batch API",
      ],
      bestFor: "Developers building with Gemini models",
    },
  ],
};

// ============================================================
// WINDSURF
// Source: https://windsurf.com/pricing — verified 2026-05-10
// ============================================================
const windsurf: ToolInfo = {
  id: "windsurf",
  name: "Windsurf",
  vendor: "Cognition AI",
  category: "ide",
  primaryUseCases: ["coding"],
  color: "#06b6d4",
  pricingUrl: "https://windsurf.com/pricing",
  plans: [
    {
      id: "windsurf-free",
      name: "Free",
      pricePerSeat: 0,
      features: ["Tab completions", "Basic Cascade", "Limited usage"],
      bestFor: "Individual developers trying Windsurf",
    },
    {
      id: "windsurf-pro",
      name: "Pro",
      pricePerSeat: 20,
      features: [
        "Extended Cascade usage",
        "All models",
        "Priority support",
      ],
      bestFor: "Individual professional developers",
    },
    {
      id: "windsurf-max",
      name: "Max",
      pricePerSeat: 200,
      features: [
        "Maximum usage",
        "Highest priority",
        "All models",
      ],
      bestFor: "Power users needing maximum capacity",
    },
    {
      id: "windsurf-teams",
      name: "Teams",
      pricePerSeat: 40,
      features: [
        "Everything in Pro",
        "Centralized billing",
        "Admin controls",
        "Usage analytics",
      ],
      bestFor: "Teams needing shared management",
      minSeats: 2,
    },
    {
      id: "windsurf-enterprise",
      name: "Enterprise",
      pricePerSeat: -1,
      features: [
        "Custom deployment",
        "Advanced security",
        "Priority support",
        "SLA",
      ],
      bestFor: "Large organizations with custom needs",
      minSeats: 10,
    },
  ],
};

// ============================================================
// EXPORTS
// ============================================================
export const ALL_TOOLS: ToolInfo[] = [
  cursor,
  githubCopilot,
  claude,
  chatgpt,
  anthropicApi,
  openaiApi,
  gemini,
  windsurf,
];

export const TOOLS_MAP: Record<ToolId, ToolInfo> = {
  cursor,
  "github-copilot": githubCopilot,
  claude,
  chatgpt,
  "anthropic-api": anthropicApi,
  "openai-api": openaiApi,
  gemini,
  windsurf,
};

export const USE_CASES: { id: UseCase; label: string; description: string }[] = [
  { id: "coding", label: "Coding", description: "Software development and programming" },
  { id: "writing", label: "Writing", description: "Content creation, copywriting, docs" },
  { id: "data", label: "Data Analysis", description: "Data processing, analytics, ML" },
  { id: "research", label: "Research", description: "Information gathering, analysis" },
  { id: "mixed", label: "Mixed", description: "Multiple use cases combined" },
];
