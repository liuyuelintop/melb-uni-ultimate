export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface QuickLink {
  title: string;
  description: string;
  href: string;
}

export interface HeroContent {
  title: string;
  description: string;
  actions: {
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "outline";
  }[];
}

export const homeFeatures: Feature[] = [
  {
    icon: "🏆",
    title: "Competitive Spirit",
    description:
      "Compete in local and national tournaments, representing the University of Melbourne.",
  },
  {
    icon: "🤝",
    title: "Community",
    description:
      "Join a welcoming community of players from all skill levels and backgrounds.",
  },
  {
    icon: "💪",
    title: "Fitness & Fun",
    description:
      "Stay active while having fun with regular practices and social events.",
  },
];

export const homeQuickLinks: QuickLink[] = [
  {
    title: "Announcements",
    description: "Stay updated with club news",
    href: "/announcements",
  },
  {
    title: "Events",
    description: "View upcoming practices & tournaments",
    href: "/events",
  },
  {
    title: "Team Roster",
    description: "View current players",
    href: "/roster",
  },
  {
    title: "Alumni Network",
    description: "Connect with alumni",
    href: "/alumni",
  },
];

export const homeHeroContent: HeroContent = {
  title: "Melbourne University Ultimate Frisbee Club",
  description:
    "Join the ultimate frisbee community at the University of Melbourne. Experience the thrill of the sport, make lifelong friends, and compete at the highest level.",
  actions: [
    { label: "Learn More", href: "/about", variant: "primary" },
    { label: "Join Us", href: "/contact", variant: "outline" },
  ],
};
