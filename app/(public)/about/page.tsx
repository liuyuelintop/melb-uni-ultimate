import Image from "next/image";
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          About Our Club
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The Melbourne University Ultimate Frisbee Club has been promoting the
          spirit of the game and building a vibrant community since 2000.
        </p>
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
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🤝</div>
              <div>
                <h3 className="font-semibold text-gray-900">Inclusivity</h3>
                <p className="text-gray-600">
                  Welcoming players of all skill levels and backgrounds
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🏆</div>
              <div>
                <h3 className="font-semibold text-gray-900">Excellence</h3>
                <p className="text-gray-600">
                  Striving for competitive success while maintaining
                  sportsmanship
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🌱</div>
              <div>
                <h3 className="font-semibold text-gray-900">Growth</h3>
                <p className="text-gray-600">
                  Supporting personal and athletic development
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Club Highlights Section */}
      <div className="mt-16 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Club Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src="/uninats-2024.webp"
              alt="Nationals team celebrating win"
              width={400}
              height={250}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center text-gray-700 text-sm">
              2024 UniSport Nationals Gold Coast Champions
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src="/umuc-2025.webp"
              alt="UMUC team photo"
              width={400}
              height={250}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center text-gray-700 text-sm">
              2025 University Mixed Ultimate Championship
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src="/bigblue-2025.webp"
              alt="Melbourne Uni team photo after winning Big Blue 2025 under lights"
              width={400}
              height={250}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center text-gray-700 text-sm">
              2025 Big Blue Champions
            </div>
          </div>
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🥇</div>
            <h3 className="text-xl font-semibold mb-2">
              2024 UniSport Nationals
            </h3>
            <p className="text-gray-600">
              Secured 1st place in the national mixed competition on the Gold
              Coast
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">
              2025 Big Blue Champions
            </h3>
            <p className="text-gray-600">
              Claimed victory against Monash in the annual Big Blue showdown
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold mb-2">Spirit Award</h3>
            <p className="text-gray-600">
              Multiple Spirit of the Game awards at tournaments
            </p>
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Club Leadership
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">CP</span>
            </div>
            <h3 className="font-semibold text-gray-900">Club President</h3>
            <p className="text-gray-600">Lee Sheng</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">VP</span>
            </div>
            <h3 className="font-semibold text-gray-900">Vice President</h3>
            <p className="text-gray-600">Joel Wong</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">TC</span>
            </div>
            <h3 className="font-semibold text-gray-900">Treasurer</h3>
            <p className="text-gray-600">Linda Chen</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">SC</span>
            </div>
            <h3 className="font-semibold text-gray-900">Secretary</h3>
            <p className="text-gray-600">Linda Chen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
