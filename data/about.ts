export interface Value {
  icon: string;
  title: string;
  description: string;
}

export interface Achievement {
  icon: string;
  title: string;
  description: string;
}

export interface Leader {
  initials: string;
  title: string;
  name: string;
}

export interface Highlight {
  image: string;
  alt: string;
  caption: string;
}

export interface HistoryMilestone {
  year: string;
  title: string;
  description: string;
}

export interface AboutContent {
  hero: {
    title: string;
    description: string;
  };
  mission: {
    title: string;
    paragraphs: string[];
  };
  values: Value[];
  highlights: Highlight[];
  history: {
    title: string;
    milestones: HistoryMilestone[];
  };
  achievements: Achievement[];
  leadership: {
    title: string;
    leaders: Leader[];
  };
}

export const aboutValues: Value[] = [
  {
    icon: "🤝",
    title: "Inclusivity",
    description: "Welcoming players of all skill levels and backgrounds",
  },
  {
    icon: "🏆",
    title: "Excellence",
    description:
      "Striving for competitive success while maintaining sportsmanship",
  },
  {
    icon: "🌱",
    title: "Growth",
    description: "Supporting personal and athletic development",
  },
];

export const aboutAchievements: Achievement[] = [
  {
    icon: "🏆",
    title: "2025 Big Blue Champions",
    description: "Back-to-back winners with a dominant win over Monash",
  },
  {
    icon: "🥇",
    title: "2024 UniSport Nationals",
    description:
      "Secured 1st place in the national mixed competition on the Gold Coast",
  },
  {
    icon: "🏆",
    title: "2024 Big Blue Champions",
    description:
      "Claimed victory against Monash in the annual Big Blue showdown",
  },
];

export const aboutLeaders: Leader[] = [
  { initials: "CP", title: "Club President", name: "Lee Sheng" },
  { initials: "VP", title: "Vice President", name: "Joel Wong" },
  { initials: "TR", title: "Treasurer", name: "Sunyang Ji" },
  { initials: "SC", title: "Secretary", name: "Arthur Lin" },
  { initials: "SM", title: "Social Media Manager", name: "Miranda Wang" },
  { initials: "EM", title: "Events Manager", name: "Nichelle" },
  { initials: "EM", title: "Events Manager", name: "Soaham" },
  { initials: "GM", title: "General Member", name: "Kat Buckser" },
];

export const aboutHighlights: Highlight[] = [
  {
    image: "/uninats-2024.webp",
    alt: "Nationals team celebrating win",
    caption: "2024 UniSport Nationals Gold Coast Champions",
  },
  {
    image: "/umuc-2025.webp",
    alt: "UMUC team photo",
    caption: "2025 University Mixed Ultimate Championship",
  },
  {
    image: "/bigblue-2025.webp",
    alt: "Melbourne Uni team photo after winning Big Blue 2025 under lights",
    caption: "2025 Big Blue Champions",
  },
];

export const aboutHistoryMilestones: HistoryMilestone[] = [
  {
    year: "2000",
    title: "Club Founded",
    description:
      "A group of passionate students established the first Ultimate Frisbee club at the University of Melbourne",
  },
  {
    year: "2002",
    title: "First Nationals",
    description:
      "Our team competed in the Australian University Games for the first time",
  },
  {
    year: "2025",
    title: "Growing Strong",
    description:
      "Nearly 25 years later, we continue to grow with over 50 active members",
  },
];

export const aboutContent: AboutContent = {
  hero: {
    title: "About Our Club",
    description:
      "The Melbourne University Ultimate Frisbee Club has been promoting the spirit of the game and building a vibrant community since 2000.",
  },
  mission: {
    title: "Our Mission",
    paragraphs: [
      "To promote the sport of Ultimate Frisbee at the University of Melbourne, fostering a welcoming community that values sportsmanship, inclusivity, and personal growth.",
      "We believe in the Spirit of the Game - a philosophy that places the responsibility for fair play on every player, emphasizing mutual respect and self-officiating.",
    ],
  },
  values: aboutValues,
  highlights: aboutHighlights,
  history: {
    title: "Our History",
    milestones: aboutHistoryMilestones,
  },
  achievements: aboutAchievements,
  leadership: {
    title: "Club Leadership",
    leaders: aboutLeaders,
  },
};
