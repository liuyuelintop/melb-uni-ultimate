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
      {/* Hero Section */}
      <div className="py-8">
        <PageHeader
          title={aboutContent.hero.title}
          description={aboutContent.hero.description}
        />
      </div>

      {/* Mission & Values */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {aboutContent.mission.title}
          </h2>
          {aboutContent.mission.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-gray-600 mb-4">
              {paragraph}
            </p>
          ))}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="space-y-4">
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

      {/* Club Highlights Section */}
      <div className="mt-16 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Club Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {aboutContent.highlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={highlight.image}
                alt={highlight.alt}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 text-center text-gray-700 text-sm">
                {highlight.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          {aboutContent.history.title}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {aboutContent.history.milestones.map((milestone, index) => (
              <HistoryMilestoneCard
                key={index}
                year={milestone.year}
                title={milestone.title}
                description={milestone.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Recent Achievements
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Leadership */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {aboutContent.leadership.title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
