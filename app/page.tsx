import { Container } from "@/components/ui";
import { Hero } from "@/components/layout/Hero";
import { FeatureCard } from "@/components/home/FeatureCard";
import { QuickLinkCard } from "@/components/home/QuickLinkCard";

export default function HomePage() {
  const features = [
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

  const quickLinks = [
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

  return (
    <Container>
      {/* Hero Section */}
      <div className="py-8">
        <Hero
          title={
            <>
              Melbourne University
              <span className="block text-blue-600">Ultimate Frisbee Club</span>
            </>
          }
          description="Join the ultimate frisbee community at the University of Melbourne. Experience the thrill of the sport, make lifelong friends, and compete at the highest level."
          actions={[
            { label: "Learn More", href: "/about", variant: "primary" },
            { label: "Join Us", href: "/contact", variant: "outline" },
          ]}
        />
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Quick Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <QuickLinkCard
              key={index}
              title={link.title}
              description={link.description}
              href={link.href}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
