import Image from "next/image";
import { Container } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { ValueCard } from "@/components/about/ValueCard";
import { AchievementCard } from "@/components/about/AchievementCard";
import { LeaderCard } from "@/components/about/LeaderCard";
import { HistoryMilestoneCard } from "@/components/about/HistoryMilestoneCard";
import { aboutContent } from "@/data";

export default function AboutPage() {
  return (
    <Container>
      {/* Hero Section - Mobile optimized */}
      <div className="py-6 sm:py-8 lg:py-12">
        <PageHeader
          title={aboutContent.hero.title}
          description={aboutContent.hero.description}
        />
      </div>

      {/* Mission & Values - Responsive side-by-side on desktop */}
      <div className="mb-12 sm:mb-16 lg:mb-20">
        <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12 lg:grid lg:grid-cols-2">
          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              {aboutContent.mission.title}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {aboutContent.mission.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base sm:text-lg text-gray-600 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {/* Values Section */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Values
            </h2>
            <div className="grid gap-3 sm:gap-4 lg:gap-6">
              {aboutContent.values.map((value, index) => (
                <ValueCard
                  key={index}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Club Highlights Section - Compact mobile gallery */}
      <div className="mb-12 sm:mb-16 lg:mb-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center">
          Club Highlights
        </h2>
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {aboutContent.highlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-all duration-200"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={highlight.image}
                  alt={highlight.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-200 hover:scale-105"
                />
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-center text-gray-700 text-sm leading-relaxed">
                  {highlight.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History - Timeline optimized for mobile */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-6 lg:p-8 mb-12 sm:mb-16 lg:mb-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          {aboutContent.history.title}
        </h2>
        <div className="max-w-5xl mx-auto">
          {/* Mobile: Vertical timeline, Desktop: Grid */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {aboutContent.history.milestones.map((milestone, index) => (
              <div key={index} className="relative">
                {/* Mobile timeline connector */}
                {index < aboutContent.history.milestones.length - 1 && (
                  <div className="absolute left-4 top-16 w-0.5 h-12 bg-gray-300 lg:hidden" />
                )}
                <HistoryMilestoneCard
                  year={milestone.year}
                  title={milestone.title}
                  description={milestone.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements - Compact mobile grid */}
      <div className="mb-12 sm:mb-16 lg:mb-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center">
          Recent Achievements
        </h2>
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {aboutContent.achievements.map((achievement, index) => (
            <AchievementCard
              key={index}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
            />
          ))}
        </div>
      </div>

      {/* Leadership - Compact mobile layout */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center">
          {aboutContent.leadership.title}
        </h2>
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {aboutContent.leadership.leaders.map((leader, index) => (
            <LeaderCard
              key={index}
              initials={leader.initials}
              title={leader.title}
              name={leader.name}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
