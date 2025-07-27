import { Container } from "@shared/components/ui/Container";
import { Hero } from "@shared/components/layout/Hero";
import { FeatureCard } from "@shared/components/home/FeatureCard";
import { QuickLinkCard } from "@shared/components/home/QuickLinkCard";
import { homeFeatures, homeQuickLinks, homeHeroContent } from "@shared/data";

export default function HomePage() {
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
          description={homeHeroContent.description}
          actions={homeHeroContent.actions}
        />
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {homeFeatures.map((feature, index) => (
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
          {homeQuickLinks.map((link, index) => (
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
