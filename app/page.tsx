import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Melbourne University
          <span className="block text-blue-600">Ultimate Frisbee Club</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join the ultimate frisbee community at the University of Melbourne.
          Experience the thrill of the sport, make lifelong friends, and compete
          at the highest level.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/about"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Learn More
          </Link>
          <Link
            href="/contact"
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            Join Us
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-2">Competitive Spirit</h3>
          <p className="text-gray-600">
            Compete in local and national tournaments, representing the
            University of Melbourne.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-2">Community</h3>
          <p className="text-gray-600">
            Join a welcoming community of players from all skill levels and
            backgrounds.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">💪</div>
          <h3 className="text-xl font-semibold mb-2">Fitness & Fun</h3>
          <p className="text-gray-600">
            Stay active while having fun with regular practices and social
            events.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Quick Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/announcements"
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <h3 className="font-semibold mb-2">Announcements</h3>
            <p className="text-sm text-gray-600">Stay updated with club news</p>
          </Link>

          <Link
            href="/events"
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <h3 className="font-semibold mb-2">Events</h3>
            <p className="text-sm text-gray-600">
              View upcoming practices & tournaments
            </p>
          </Link>

          <Link
            href="/login"
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <h3 className="font-semibold mb-2">Team Roster</h3>
            <p className="text-sm text-gray-600">
              Login to view current players
            </p>
          </Link>

          <Link
            href="/login"
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <h3 className="font-semibold mb-2">Alumni Network</h3>
            <p className="text-sm text-gray-600">
              Login to connect with alumni
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
