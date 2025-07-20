import Image from "next/image";
import { Container } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { ValueCard } from "@/components/about/ValueCard";
import { AchievementCard } from "@/components/about/AchievementCard";
import { LeaderCard } from "@/components/about/LeaderCard";

export default function AboutPage() {
  const values = [
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

  const achievements = [
    {
      icon: "🥇",
      title: "2024 UniSport Nationals",
      description:
        "Secured 1st place in the national mixed competition on the Gold Coast",
    },
    {
      icon: "🏆",
      title: "2025 Big Blue Champions",
      description:
        "Claimed victory against Monash in the annual Big Blue showdown",
    },
    {
      icon: "🌟",
      title: "Spirit Award",
      description: "Multiple Spirit of the Game awards at tournaments",
    },
  ];

  const leaders = [
    { initials: "CP", title: "Club President", name: "Lee Sheng" },
    { initials: "VP", title: "Vice President", name: "Joel Wong" },
    { initials: "TC", title: "Treasurer", name: "Linda Chen" },
    { initials: "SC", title: "Secretary", name: "Linda Chen" },
  ];

  const highlights = [
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

  return (
    <Container>
      {/* Hero Section */}
      <div className="py-8">
        <PageHeader
          title="About Our Club"
          description="The Melbourne University Ultimate Frisbee Club has been promoting the spirit of the game and building a vibrant community since 2000."
        />
      </div>

      {/* Mission & Values */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-4">
            To promote the sport of Ultimate Frisbee at the University of
            Melbourne, fostering a welcoming community that values
            sportsmanship, inclusivity, and personal growth.
          </p>
          <p className="text-lg text-gray-600">
            We believe in the Spirit of the Game - a philosophy that places the
            responsibility for fair play on every player, emphasizing mutual
            respect and self-officiating.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="space-y-4">
            {values.map((value, index) => (
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
          {highlights.map((highlight, index) => (
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
          Our History
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2000</div>
              <h3 className="font-semibold text-gray-900 mb-2">Club Founded</h3>
              <p className="text-gray-600">
                A group of passionate students established the first Ultimate
                Frisbee club at the University of Melbourne
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2002</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                First Nationals
              </h3>
              <p className="text-gray-600">
                Our team competed in the Australian University Games for the
                first time
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2025</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Growing Strong
              </h3>
              <p className="text-gray-600">
                Nearly 25 years later, we continue to grow with over 50 active
                members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Recent Achievements
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
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
          Club Leadership
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((leader, index) => (
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
